CREATE TABLE IF NOT EXISTS agent_tasks (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    priority INTEGER DEFAULT 0,
    assignee TEXT,
    payload JSONB DEFAULT '{}'::JSONB,
    result JSONB,
    error TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS agent_tasks_status_idx ON agent_tasks (status);
CREATE INDEX IF NOT EXISTS agent_tasks_assignee_idx ON agent_tasks (assignee);
CREATE INDEX IF NOT EXISTS agent_tasks_priority_idx ON agent_tasks (priority DESC, created_at ASC);

CREATE OR REPLACE FUNCTION agent_tasks_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS agent_tasks_set_updated_at_trg ON agent_tasks;
CREATE TRIGGER agent_tasks_set_updated_at_trg
BEFORE UPDATE ON agent_tasks
FOR EACH ROW
EXECUTE FUNCTION agent_tasks_set_updated_at();

CREATE OR REPLACE FUNCTION agent_take_task(p_assignee TEXT)
RETURNS SETOF agent_tasks AS $$
DECLARE
    v_task agent_tasks%ROWTYPE;
BEGIN
    LOOP
        SELECT * INTO v_task
        FROM agent_tasks
        WHERE status = 'pending'
        ORDER BY priority DESC, created_at ASC
        FOR UPDATE SKIP LOCKED
        LIMIT 1;

        EXIT WHEN NOT FOUND;

        UPDATE agent_tasks
        SET status = 'assigned',
            assignee = p_assignee,
            started_at = NOW()
        WHERE id = v_task.id
        RETURNING * INTO v_task;

        RETURN NEXT v_task;
        RETURN;
    END LOOP;

    RETURN;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION agent_update_task_result(
    p_id BIGINT,
    p_status TEXT,
    p_result JSONB DEFAULT NULL,
    p_error TEXT DEFAULT NULL
) RETURNS agent_tasks AS $$
DECLARE
    v_task agent_tasks%ROWTYPE;
BEGIN
    UPDATE agent_tasks
    SET status = p_status,
        result = p_result,
        error = p_error,
        completed_at = CASE WHEN p_status IN ('completed','failed') THEN NOW() ELSE completed_at END
    WHERE id = p_id
    RETURNING * INTO v_task;

    RETURN v_task;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION agent_insert_tasks(p_tasks JSONB)
RETURNS SETOF agent_tasks AS $$
DECLARE
    v_task JSONB;
    v_record agent_tasks%ROWTYPE;
BEGIN
    FOR v_task IN SELECT * FROM jsonb_array_elements(p_tasks)
    LOOP
        INSERT INTO agent_tasks (title, description, priority, assignee, payload, status)
        VALUES (
            COALESCE(v_task->>'title', 'Untitled Task'),
            v_task->>'description',
            COALESCE((v_task->>'priority')::INT, 0),
            v_task->>'assignee',
            COALESCE(v_task->'payload', '{}'::JSONB),
            COALESCE(v_task->>'status', 'pending')
        )
        RETURNING * INTO v_record;

        RETURN NEXT v_record;
    END LOOP;

    RETURN;
END;
$$ LANGUAGE plpgsql;
