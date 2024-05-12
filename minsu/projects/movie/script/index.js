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

      const tabGubun = tabButton === 'search' ? result : favorites
      const favoriteIndex = tabGubun.findIndex(movie => movie.imdbID === imdbID)
      const nextResult = [...tabGubun]
      const favoriteResult = nextResult[favoriteIndex].favorite

      nextResult[favoriteIndex].favorite = !favoriteResult;
      let newFavorites = [];
      if(!favoriteResult){
        const checkFirstFavorites = favorites.length === 0 ? 
          [nextResult[favoriteIndex]] : 
          [...favorites, nextResult[favoriteIndex]]

        newFavorites = checkFirstFavorites
        if(favorites.length > 0) removeItem('favorites')
        setItem('favorites', newFavorites)
      }else{
        removeItem('favorites')
        newFavorites = favorites.filter(movie => movie.imdbID !== imdbID)
        setItem('favorites', newFavorites)
      }

      setItem('totalCount', newFavorites.length)
      this.setState({
        ...this.state,
        favorites: newFavorites,
      })

      searchResult.setState({
        ...searchResult.state,
        result: nextResult
      })
    },
    tabButton: this.state.tabButton
  })

  const $inputValue = document.getElementById('inputValue')

  const fetchData = async(firstPage = false) => {

    const {result, totalCount, tabButton, inputValue, page} = this.state
    
    searchResult.setState({
      result: result,
      totalCount: totalCount,
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