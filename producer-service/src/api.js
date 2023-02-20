const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const { Kafka ,Partitioners } = require('kafkajs');
const kafka = new Kafka({
  clientId: 'sample-kafka',
  brokers: ['kafka:29092']
});

const producer = kafka.producer(
  {
    createPartitioner: Partitioners.LegacyPartitioner
  }
);

async function connectProducer() {
  await producer.connect();
  console.log('Kafka producer is ready');
}

connectProducer().catch(console.error);


router.use(bodyParser.json());

router.post('/sample', (req, res) => {

    const message = {
        value: JSON.stringify(req.body)
      };
    
    producer.send({
        topic: 'sample-created',
        messages: [message]
      });
    
      console.log('Message published to Kafka:', message);

  res.json(req.body);
});

module.exports = router;