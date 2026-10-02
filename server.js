const express = require('express');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
//get data
app.get('/data', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM notes');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }   
});
//get note by id
app.get('/notes/:id', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM notes WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).send({ error: 'Note not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Internal server error' });
    }
});
//post
app.post('/notes', async (req, res) => {
    const { title, content } = req.body;
    try {
        const result = await pool.query('INSERT INTO notes (title, content) VALUES ($1, $2) RETURNING *', [title, content]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Internal server error' });
    }
});
//put(update)
app.put('/notes/:id', async (req, res) => {
    const { title, content } = req.body;
    
    try {
        const result = await pool.query('UPDATE notes SET title = $1, content = $2 WHERE id = $3 RETURNING *', 
            [title, content, req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).send({ error: 'Note not found' });
        }
        res.json(result.rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Internal server error' });
    }
});
//delete
app.delete('/notes/:id', async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM notes WHERE id = $1 RETURNING *', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).send({ error: 'Note not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Internal server error' });
    }
});

app.get('/notes',async (req, res) => {
    const{title} = req.query;
    try {
        const result = await pool.query('SELECT * FROM notes WHERE title ILIKE $1', [`%${title}%`]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

