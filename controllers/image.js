import { ClarifaiStub, grpc } from 'clarifai-nodejs-grpc'

const stub = ClarifaiStub.grpc()

const metadata = new grpc.Metadata()
metadata.set('authorization', 'Key 99edfc172f024dd18e90e69151214e8a')

const getPredictions = (inputUrl, stub) => {
  // const input =
  // 'https://media.suara.com/pictures/653x366/2019/03/03/83829-sylvester-stallone-memerankan-rambo-instagram.jpg'

  // https://i.ibb.co/89D47N3/christina-wocintechchat-com-gl-Rqy-WJg-Ue-Y-unsplash.jpg

  return new Promise((resolve, reject) => {
    stub.PostModelOutputs(
      {
        // This is the model ID of a publicly available General model. You may use any other public or custom model ID.
        model_id: 'a403429f2ddf4b49b307e318f00e528b',
        inputs: [{ data: { image: { url: inputUrl } } }],
      },
      metadata,
      (err, response) => {
        if (err) {
          reject(err)
        }

        if (response.status.code !== 10000) {
          reject(
            `Received failed status: ${response.status.description} \n ${response.status.details}`,
          )
        }
        resolve(response)
      },
    )
  })
}

const handleImage = (db) => async (req, res) => {
  const { id, inputUrl } = req.body

  try {
    const prediction = await getPredictions(inputUrl, stub)
    if (!prediction) {
      throw new Error('Failed')
    }

    const [user] = await db('users')
      .where({ id })
      .increment('entries', 1)
      .returning('*')

    if (user) {
      res.json({ response: 'success', prediction, user })
    } else {
      res.status(404).json({ response: 'user not found' })
    }
  } catch (error) {
    res.status(404).json({ response: 'error updating entries' })
  }
}

export default handleImage
