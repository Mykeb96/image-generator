import { useState, useEffect } from 'react'
import Head from 'next/head'
import { Configuration, OpenAIApi } from "openai";


export default function Home() {

  // set state for user input, the image urls, and the tagline
  const [userInput, setUserInput] = useState<string>('')
  const [images, setImages] = useState<Array<string>>([])
  const [tagline, setTagline] = useState<string>('')

  // OpenAI config
  const configuration = new Configuration({
    apiKey: process.env.NEXT_PUBLIC_DB_KEY,
  });
  const openai = new OpenAIApi(configuration);

  // create promise to resolve images from openai "create image"
  function generateImages(){
    return new Promise(resolve => {
      resolve(openai.createImage({
        prompt: userInput,
        n: 3,
        size: "512x512",
      }))
    })
  }

  // create promise to resolve the tagline from openai "create completion"
  // uses same prompt given by user to generate the images
  function generateTagline(){
    return new Promise(resolve => {
      resolve(openai.createCompletion({
        model: "text-davinci-003",
        prompt: `Give me a tagline for the image prompt of: ${userInput}`,
        max_tokens: 2048,
        temperature: 0,
      }))
    })
  }

  // resets state to show "loading..." -> fetches new images -> fetches tagline
  async function fetchImages(){
    setImages([])
    setTagline('')
    const response: any = await generateImages()
    
    setImages([response.data.data[0].url, response.data.data[1].url, response.data.data[2].url])
    fetchTagline()
  }

  // fetches and stores tagline in state
  async function fetchTagline(){
    const response: any = await generateTagline()

    setTagline(response.data.choices[0].text)
  }

  // onChange function to handle storing input field's value into state
  const handleChange = (e: any) => {
    setUserInput(e.target.value)
  }


  return (
    <>
      <Head>
        <title>Asset Maker</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className='main-container'>
          <div className='input-container'>
            <input placeholder='Write a prompt...' onChange={(e: any) => handleChange(e)} onSubmit={() => console.log(userInput)}/>
            <button onClick={fetchImages}>Generate!</button>
          </div>
          {images.length > 0 ? 
          <div className='images'>
            {images.map((el: any, index: any) => <img src={el} key={index} className='image'/>)} 
          </div>
          : 
          <p className='loading'>loading...</p>}
        </div>
            {tagline != '' ? <h2 className='tagline'>{tagline}</h2> : ''}
      </main>
    </>
  )
}
