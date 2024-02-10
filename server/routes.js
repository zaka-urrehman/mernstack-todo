const express = require('express')
const router = express.Router()
const { getConnectedClient } = require('./database')
const { ObjectId } = require('mongodb')


const getCollection = () => {
    const client = getConnectedClient()
    const collection = client.db("todosdb").collection("todos")
    return collection
}

// GET /todos 
router.get('/todos', async (req, res) => {
    const collection = getCollection()
    const todos = await collection.find({}).toArray()
    res.status(200).json(todos)
})

// POST  /todos
router.post('/todos', async (req, res) => {
    const collection = getCollection()
    const { todo } = req.body
    const newTodo = await collection.insertOne({ todo, status: false })
    res.status(200).json({ todo, status: false, _id: newTodo.insertedId })
})

// DELTE /todos/:id
router.delete('/todos/:id', async (req, res) => {
    const collection = getCollection();
    const _id = new ObjectId(req.params.id);
    try {
        const deleteResult = await collection.deleteOne({ _id });
        if (deleteResult.deletedCount === 1) {
            res.status(200).json({ message: "Todo deleted successfully" });
        } else {
            res.status(404).json({ error: "Todo not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
})

// PUT /todos/:id
router.put('/todos/:id', async (req, res) => {
    const collection = getCollection()
    const _id = new ObjectId(req.params.id)
    // const status = req.body
    try {
        const todo = await collection.findOne({_id})
        if(!todo){
            return res.status(404).json({error:`Todo with id ${_id} not found`})
        }
        const newStatus = !todo.status
        const updateResult = await collection.updateOne({ _id }, { $set: { status: newStatus } })
        if(updateResult.modifiedCount === 1){
            res.status(200).json({message:"successfully updated todo"})
        }
        return res.status(500).json({error:"Failed to update"})
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }

})


module.exports = router