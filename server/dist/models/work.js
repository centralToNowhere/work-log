"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = getAll;
exports.create = create;
async function getAll(fastify) {
    const res = await fastify.pg.query('SELECT id, title, description, amount, created_at FROM estimates ORDER BY id');
    return res.rows;
}
async function create(fastify, e) {
    const res = await fastify.pg.query('INSERT INTO estimates (title, description, amount) VALUES ($1, $2, $3) RETURNING id, title, description, amount, created_at', [e.title, e.description || null, e.amount]);
    return res.rows[0];
}
