const db = require('../config/db');

async function getSummary(req, res, next) {
  try {
    const result = await db.query(
      `SELECT
         (SELECT COUNT(*)::int FROM projects WHERE user_id = $1) AS "totalProjects",
         (SELECT COUNT(*)::int
            FROM tasks t
            INNER JOIN projects p ON p.id = t.project_id
            WHERE p.user_id = $1) AS "totalTasks",
         (SELECT COUNT(*)::int
            FROM tasks t
            INNER JOIN projects p ON p.id = t.project_id
            WHERE p.user_id = $1 AND t.status = 'Completed') AS "completedTasks",
         (SELECT COUNT(*)::int
            FROM tasks t
            INNER JOIN projects p ON p.id = t.project_id
            WHERE p.user_id = $1 AND t.status = 'Pending') AS "pendingTasks",
         (SELECT COUNT(*)::int
            FROM projects
            WHERE user_id = $1 AND status = 'In Progress') AS "projectsInProgress"`,
      [req.user.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getSummary,
};
