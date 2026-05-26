const { pool: db } = require('../config/database');

const getFilters = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM filters');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server Error', error: error.message});
    }
};

const getFilterById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await db.query('SELECT * FROM filters WHERE id = $1', [id]);
        const filters = result.rows;

        if (filters.length === 0) {
            return res.status(404).json({message: 'Filter not found'});
        }
        res.json(filters[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server Error', error: error.message});
    }
}

const createFilter = async (req, res) => {
    try {
        const {name, type} = req.body;

    if (!name || !type) {
        return res.status(400).json({message: 'Name and type are required'});
    }

    const query = 'INSERT INTO filters (name, type) VALUES ($1, $2) RETURNING id';
    const result = await db.query(query, [name, type]);

    const newFilter = {
        id: result.rows[0].id,
        name: name,
        type: type
    };

    res.status(201).json(newFilter);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server Error', error: error.message});
    }
};

const deleteFilter = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await db.query('DELETE FROM filters WHERE id = $1', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({message: 'Filter not found'});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server Error', error: error.message});
    }
}

module.exports = {
    getFilters,
    getFilterById,
    createFilter,
    deleteFilter
}