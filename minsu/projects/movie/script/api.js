import {API_URL} from "./config.js";

export const request = async(search,page) => {
  try{
    const res = await fetch(`${API_URL}&s=${search}&page=${page}`)

    if(!res.ok){
      throw new Error('호출 실패')
    }

    return await res.json()
  }catch(e){
    alert(e.message)
  }
}