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

export const fetchData = async(root, searchResult, firstPage = false) => {

  const {result, tabButton, inputValue, page, favorites} = root.state
  
  if(inputValue.trim() === '') return
  
  searchResult.setState({
    ...searchResult.state,
    isLoading: true,
  })

  if(tabButton === 'favorite'){
    searchResult.setState({
      ...searchResult.state,
      isLoading: false,
      result: root.state.favorites.filter( movie => movie.Title.toLowerCase().includes(inputValue.toLowerCase()))
    })
  }else{
    const checkPage = firstPage ? 1 : page
    const resultData = await request(inputValue, page);
  
    let nextData = []
    let nextCount = 0
    let nextPage = 1

    if(resultData.Response === 'True' && 'Search' in resultData){
      if(firstPage) window.scrollTo(0, 0)
  
      resultData.Search.forEach(item => {
        item.favorite = false;
        const isFavorite = favorites.some(favorite => favorite.imdbID === item.imdbID);
        if (isFavorite) item.favorite = true;
      })
  
      nextData = checkPage === 1 ? resultData.Search : [...result, ...resultData.Search]
      nextCount = resultData.totalResults;
      nextPage = firstPage ? 1 : page + 1
    }

    root.setState({
      ...root.state,
      result: nextData,
      totalCount: nextCount,
      page: nextPage
    })

    searchResult.setState({
      ...searchResult.state,
      result: nextData,
      totalCount: nextCount,
      isLoading: false,
    })

  }

}