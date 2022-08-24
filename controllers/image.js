import { ClarifaiStub, grpc } from 'clarifai-nodejs-grpc'

const stub = ClarifaiStub.grpc()

const metadata = new grpc.Metadata()
metadata.set('authorization', 'Key 99edfc172f024dd18e90e69151214e8a')

const getPredictions = (inputUrl) => {
  let data
  // const input =
    // 'https://media.suara.com/pictures/653x366/2019/03/03/83829-sylvester-stallone-memerankan-rambo-instagram.jpg'

  // https://i.ibb.co/89D47N3/christina-wocintechchat-com-gl-Rqy-WJg-Ue-Y-unsplash.jpg
  stub.PostModelOutputs(
    {
      // This is the model ID of a publicly available General model. You may use any other public or custom model ID.
      model_id: 'a403429f2ddf4b49b307e318f00e528b',
      inputs: [{ data: { image: { url: inputUrl } } }],
    },
    metadata,
    (err, response) => {
      if (err) {
        throw new Error('Error: ' + err)
      }

      if (response.status.code !== 10000) {
        throw new Error(
          `Received failed status: ${response.status.description} \n ${response.status.details}`,
        )
      }

      data = response
    },
  )
  return data
}

const handleImage = (db) => async (req, res) => {
  const { id, inputUrl } = req.body
  
  try {
    const predictions = getPredictions(inputUrl)
    
    console.log(predictions);
    
    const [user] = await db('users')
      .where({ id })
      .increment('entries', 1)
      .returning('*')

    if (user) {
      res.json({ response: 'success', predictions, user })
    } else {
      res.status(404).json({ response: 'user not found' })
    }
  } catch (error) {
    res.status(404).json({ response: 'error updating entries' })
  }
}

export default handleImage
