const { Kafka } = require('kafkajs')
const express = require('express')
const { MongoClient } = require('mongodb')
const app = express()

const kafka = new Kafka({
  clientId: 'sample-kafka',
  brokers: ['kafka:29092']
})

const consumer = kafka.consumer({ groupId: 'my-group' })

async function run() {


  const uri = 'mongodb://mongo:27017/sample-db'
  const client = new MongoClient(uri)
  await client.connect()

  const collection = client.db('sample-db').collection('sample')

  await consumer.connect()
  await consumer.subscribe({ topic: 'sample-created', fromBeginning: true })

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const value = JSON.parse(message.value.toString())
      const result = await collection.insertOne({ value, partition, offset: message.offset })
      console.log(`Inserted message with id ${result.insertedId}`)
      console.log({
        value: message.value.toString(),
        partition,
        offset: message.offset
      })
    },
  })
}

run().catch(console.error);

