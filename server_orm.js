const express = require('express');
const AppDataSource = require('./db');

const app = express();
app.use(express.json());

AppDataSource.initialize()
    .then(() => {
        console.log('Data Source has been initialized!');
    })
    .catch((err) => {
        console.error('Error during Data Source initialization:', err);
    });  

//1.get users & notes
app.get('/users',async (req, res) => {
    const userRepository = AppDataSource.getRepository('User');
    const user = await userRepository.find();
    res.json(user);
});
//2.post users
app.post('/users', async (req, res) => {
    const userRepository = AppDataSource.getRepository('User');
    const newUser = userRepository.create(req.body);
    const savedUser = await userRepository.save(newUser);
    res.status(201).json(savedUser);
});
//3.put users
app.put('/users/:id', async (req, res) => {
    const userRepository = AppDataSource.getRepository('User');
    const user = await userRepository.findOneBy({ id: parseInt(req.params.id) });

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    userRepository.merge(user, req.body);
    const updatedUser = await userRepository.save(user);
    res.json(updatedUser);
});

//4.delete users
app.delete('/users/:id', async (req, res) => {
    const userRepository = AppDataSource.getRepository('User');
    const user = await userRepository.findOneBy({ id: parseInt(req.params.id) });
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    await userRepository.remove(user);
    res.status(204).end();
});
//1.post notes
app.post('/notes', async (req, res) => {
    const {title, content, userId} = req.body;
    const noteRepository = AppDataSource.getRepository('Note');
    const userRepository = AppDataSource.getRepository('User');

    const user = await userRepository.findOneBy({ id: userId });
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const newNote = noteRepository.create({ title, content, user });
    const savedNote = await noteRepository.save(newNote);
    res.status(201).json(savedNote);
});
//2.get notes
app.get('/notes', async (req, res) => {
    const noteRepository = AppDataSource.getRepository('Note');
    const notes = await noteRepository.find({ relations: ['user'] });
    res.json(notes);
});
// query typeorm
app.get('/users/:id/notes', async (req, res) => {
    const userRepository = AppDataSource.getRepository('User');

    const userId = parseInt(req.params.id);

    const user = await userRepository.findOne({
        where: { id: userId },
        relations: { notes: true},
    });
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.json(user.notes);
});

//3.put note by id
app.put('/notes/:id', async (req, res) => {
    const noteRepository = AppDataSource.getRepository('Note');
    const note = await noteRepository.findOneBy({ id: parseInt(req.params.id) });

    if (!note) {
        return res.status(404).json({ error: 'Note not found' });
    }
    noteRepository.merge(note, req.body);
    const updatedNote = await noteRepository.save(note);
    res.json(updatedNote);
});
//4.delete notes
app.delete('/notes/:id', async (req, res) => {
    const noteRepository = AppDataSource.getRepository('Note');
    const note = await noteRepository.findOneBy({ id: parseInt(req.params.id) });

    if (!note) {
        return res.status(404).json({ error: 'Note not found' });
    }

    await noteRepository.remove(note);
    res.status(204).end();
});

const PORT = process.env.PORT || 3000;  
 app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});    



