const express = require('express');
const helmet = require('helmet');
const knex = require('knex');

const knexConfig = require('./knexfile.js');

const db = knex(knexConfig.development);

const server = express();

server.use(helmet());
server.use(express.json());

server.get('/api/cohorts', async (req, res) => {
    try {
        const cohorts = await db('cohorts');
        res.status(200).json(cohorts);
    } catch (error) {
        res.status(500).json(error);
    }
});

server.get('/api/cohorts/:id/students', async (req, res) => {
    try {
        const { id } = req.params;
        const student = await db('students')
        .where({ cohort_id: id })
        if ( student ) {
            res.status(200).json(student);
        } else {
            res.status(404).json({ message: "The student with the specified ID does not exist." });
        }
    }catch (error) {
        res.status(500).json({ 
                    message: "Error retrieving cohort"
        });
    }
});


server.get('/api/cohorts/:id', async (req, res) => {
        const cohort = await db('cohorts')
            .where({ id: req.params.id })
            .first()
    
    try {
        if (cohort) {
            res.status(200).json(cohort);    
        } else {
            res.status(404).json({ message: 'No cohort found by this ID' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

server.post('/api/cohorts', async (req, res) => {
    try {
      const [id] = await db('cohorts').insert(req.body);
      const cohort = await db('cohorts')
        .where({ id })
        .first();
      res.status(201).json(cohort);
    } catch (error) {
      res.status(500).json({ message:'Error creating cohort' });
    }
});

server.put('/api/cohorts/:id', async (req, res) => {
    try {
      const count = await db('cohorts')
        .where({ id: req.params.id })
        .update(req.body);
      if (count > 0) {
        const cohort = await db('cohorts')
          .where({ id: req.params.id })
          .first();
        res.status(200).json({ message: 'Update successful' });
      } else {
        res.status(404).json({ message: 'The cohort with this ID was not found' });
      }
    } catch (error) {
        res.status(500).json({ message:'Error updating cohort' });
    }
});

server.delete('/api/cohorts/:id', async (req, res) => {
    try {
      const count = await db('cohorts')
        .where({ id: req.params.id })
        .del();
  
      if (count > 0) {
        res.status(204).json({ message:'Delete successful' });
      } else {
        res.status(404).json({ message: 'The cohort with this ID was not found' });
      }
    } catch (error) {
        res.status(500).json({ message:'Error deleting cohort' });
    }
});

server.post('/students', async (req, res) => {
    try {
      const [id] = await db('students').insert(req.body);
      const student = await db('students')
        .where({ id })
        .first();
      res.status(201).json(student);
    } catch (error) {
      res.status(500).json({ message:'Error creating student' });
    }
});

server.get('/students', async (req, res) => {
    try {
        const students = await db('students');
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ error: 'Could not retrieve students' });
    }
});

server.get('/students/:id', async (req, res) => {
    const student = await db('students')
        .where({ id: req.params.id })
        .first()
    const cohort = await db('cohorts')
        .where({ id: req.params.cohort_id })
    try {
        if (student) {
            res.status(200).json([student.id, student.name, cohort.name]);    
        } else {
            res.status(404).json({ message: 'No student found by this ID' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error retrieving student' });
    }
});

server.put('/students/:id', async (req, res) => {
    try {
      const count = await db('students')
        .where({ id: req.params.id })
        .update(req.body);
      if (count > 0) {
        const student = await db('students')
          .where({ id: req.params.id })
          .first();
        res.status(200).json({ message: 'Update successful' });
      } else {
        res.status(404).json({ message: 'The student with this ID was not found' });
      }
    } catch (error) {
        res.status(500).json({ message:'Error updating cohort' });
    }
});

server.delete('/student/:id', async (req, res) => {
    try {
      const count = await db('students')
        .where({ id: req.params.id })
        .del();
  
      if (count > 0) {
        res.status(204).json({ message:'Delete successful' });
      } else {
        res.status(404).json({ message: 'The student with this ID was not found' });
      }
    } catch (error) {
        res.status(500).json({ message:'Error deleting student' });
    }
});

const port = process.env.PORT || 4000;

server.listen(port, () => {
    console.log(`\n Up and running on port ${port} \n`)
});