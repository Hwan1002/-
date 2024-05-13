import {request} from './api.js'
import {setItem, getItem, removeItem} from './storage.js'
import TapButton from './TabButton.js'
import SearchResult from './SearchResult.js'
import SearchHandler from './SearchHandler.js'

function Movie () {
  this.state = {
    tabButton: 'search',
    inputValue: '',
    result: [],
    page: 1,
    totalCount: 0,
    isLoading: false,
    favorites: []
  }

  this.setState = nextState => {
    this.state = nextState
  }

  this.setState({
    ...this.state,
    favorites: getItem('favorites', '') === '' ? [] : getItem('favorites', ''),
    totalCount: getItem('totalCount', 0) === 0 ? 0 : getItem('totalCount', 0),
  })

  new TapButton({
    initialState: this.state.tabButton, 
    onClick: (tagName) => {
      let searchList = [];

      if(tagName === 'search'){
        searchList = this.state.result
      }else{
        searchList = this.state.favorites
      }

      this.setState({
        ...this.state,
        tabButton: tagName
      })

      searchResult.setState({
        ...searchResult.state,
        result: searchList,
        tabButton: tagName
      })

    }
  })

  const searchResult = new SearchResult({
    initialState: {
      result: this.state.result,
      totalCount: this.state.totalCount,
      tabButton: this.state.tabButton,
      isLoading: false
    },
    onScrollEnded: () => {
      fetchData()
    },
    onFavoriteClick: (imdbID) => {
      const {result, favorites, tabButton} = this.state

      const resultIndex = result.findIndex(movie => movie.imdbID === imdbID)
      const favoriteIndex = favorites.findIndex(movie => movie.imdbID === imdbID)

      let saveResult;
      if (favoriteIndex >= 0) {
        saveResult = favorites.filter(movie => movie.imdbID !== imdbID);
      } else {
        const updatedMovie = { ...result[resultIndex], favorite: !result[resultIndex].favorite };
        saveResult = [...favorites, updatedMovie];
      }

      setItem('favorites', saveResult)
      setItem('totalCount', saveResult.length)

      const nextResult = [...result]
      if(result.length > 0) nextResult[resultIndex].favorite = !result[resultIndex].favorite

      this.setState({
        ...this.state,
        result: nextResult,
        favorites: saveResult,
      })

      searchResult.setState({
        ...searchResult.state,
        result: tabButton === 'search' ? nextResult : saveResult
      })
    },
    tabButton: this.state.tabButton
  })

  const $inputValue = document.getElementById('inputValue')

  const fetchData = async(firstPage = false) => {

    const {result, totalCount, tabButton, inputValue, page, favorites} = this.state
    
    searchResult.setState({
      ...searchResult.state,
      isLoading: true,
    })

    if(tabButton === 'favorite'){
      searchResult.setState({
        ...searchResult.state,
        result: searchResult.state.result.filter( movie => movie.Title === inputValue)
      })
    }

    const checkPage = firstPage ? 1 : page
    const resultData = await request(inputValue, page);

    if(resultData.Response === 'True' && 'Search' in resultData){
      if(firstPage) window.scrollTo(0, 0)

      resultData.Search.forEach(item => {
        item.favorite = false;
        const isFavorite = favorites.some(favorite => favorite.imdbID === item.imdbID);
        if (isFavorite) item.favorite = true;
      })

      const nextData = checkPage === 1 ? 
        resultData.Search : 
        [...result, ...resultData.Search]

      this.setState({
        ...this.state,
        isLoading: false,
        result: nextData,
        totalCount: resultData.totalResults,
        page: firstPage ? 1 : page + 1
      })

      searchResult.setState({
        result: nextData,
        totalCount: resultData.totalResults,
        tabButton: tabButton,
        isLoading: false,
      })
    }else{
      this.setState({
        ...this.state,
        isLoading: false,
        result: [],
        totalCount: 0,
        page: 1
      })

      searchResult.setState({
        result: [],
        totalCount: 0,
        isLoading: false,
      })
    }
  }

  new SearchHandler({
    setState: () =>{
      this.setState({
        ...this.state,
        isLoading: true,
        inputValue: $inputValue.value
      })
    },
    resultSetState: () => {
      searchResult.setState({
        result: this.state.result,
        totalCount: this.state.totalCount,
        isLoading: true,
      })
    },
    fetchData: () => {
      fetchData(true)
    }
  })

}

new Movie()