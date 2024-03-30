import {apiKey} from '../constants';
import axios from 'axios';
const client = axios.create({
  headers: {
    Authorization: 'Bearer ' + apiKey,
    'Content-Type': 'application/json',
  },
});

const chatgptUrl = 'https://api.openai.com/v1/chat/completions';
const dalleUrl = 'https://api.openai.com/v1/images/generations';

export const apiCall = async (prompt, messages) => {
  // // Logic 1 : this will check the prompt from chatgpt if user wants to create an image
  try {
    const res = await client.post(chatgptUrl, {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: `Does this message want to generate an AI picture, image, art or anything similar? ${prompt} . Simply answer with a yes or no.`,
        },
      ],
    });
    isArt = res.data?.choices[0]?.message?.content;
    isArt = isArt.trim();
    if (isArt.toLowerCase().includes('yes')) {
      console.log('dalle api call');
      return dalleApiCall(prompt, messages);
    } else {
      console.log('chatgpt api call');
      return chatgptApiCall(prompt, messages);
    }
  } catch (err) {
    console.log('error: ', err);
    return Promise.resolve({success: false, msg: err.message});
  }

  // // Logic 2 : sometimes chatgpt does not understand the art messages but thats fine, you can use this approach :)

  // prompt = prompt.toLowerCase();
  // let isArt = prompt.includes('image') || prompt.includes('sketch') || prompt.includes('art') || prompt.includes('picture') || prompt.includes('drawing');
  // if(isArt){
  //     console.log('dalle api call');
  //     return dalleApiCall(prompt, messages)
  // }else{
  //     console.log('chatgpt api call')
  //     return chatgptApiCall(prompt, messages);
  // }
};

const chatgptApiCall = async (prompt, messages) => {
  try {
    const res = await client.post(chatgptUrl, {
      model: 'gpt-3.5-turbo',
      messages,
    });

    let answer = res.data?.choices[0]?.message?.content;
    messages.push({role: 'assistant', content: answer.trim()});
    // console.log('got chat response', answer);
    return Promise.resolve({success: true, data: messages});
  } catch (err) {
    console.log('error: ', err);
    return Promise.resolve({success: false, msg: err.message});
  }
};

const dalleApiCall = async (prompt, messages) => {
  try {
    const res = await client.post(dalleUrl, {
      prompt,
      n: 1,
      size: '512x512',
    });

    let url = res?.data?.data[0]?.url;
    // console.log('got image url: ',url);
    messages.push({role: 'assistant', content: url});
    return Promise.resolve({success: true, data: messages});
  } catch (err) {
    console.log('error: ', err);
    return Promise.resolve({success: false, msg: err.message});
  }
};
// TO implement prompt for chatgpt vision api call
export const chatvisionApiCall = async (base64Image, dataType, messages) => {
  //   console.log('image url inside the function: ', image_url);
  try {
    const res = await client.post(chatgptUrl, {
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              // text: 'この画像を説明してください',
              text: 'describe this math image and explain as if you are explaining to a 9th graderew',
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:${dataType};base64,${base64Image}`,
                detail: 'low',
              },
            },
          ],
        },
      ],
      max_tokens: 100,
    });
    console.log('the data got here ', res.data);
    console.log('the messae got here ', res.data?.choices[0]);
    let answer = res.data?.choices[0]?.message?.content;
    messages.push({role: 'assistant', content: answer.trim()});
    // console.log('got chat response', answer);
    return Promise.resolve({success: true, data: messages});
  } catch (err) {
    console.log('error: ', err);
    return Promise.resolve({success: false, msg: err.message});
  }
};
