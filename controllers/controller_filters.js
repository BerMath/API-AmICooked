const { promisePool: db } = require('../config/database');

const getFilters = async (req, res) => {
    try {
        const [filters] = await db.query('SELECT * FROM Filters');
        res.json(filters);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server Error', error: error.message});
    }
};

const getFilterById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const [filters] = await db.query('SELECT * FROM Filters WHERE id = ?', [id]);

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

    const query = 'INSERT INTO Filters (name, type) VALUES (?, ?)';
    const [result] = await db.query(query, [name, type]);

    const newFilter = {
        id: result.insertId,
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
        const [result] = await db.query('DELETE FROM Filters WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
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