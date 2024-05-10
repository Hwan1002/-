/**
 * @description 검색, 즐겨찾기
 * @param initialState tabButton
 * @param onClick
 */

export default function TabButton({initialState, onClick}){

  this.state = initialState

  const searchTab = document.getElementById('search')
  const favoriteTab = document.getElementById('favorite')

  searchTab.style.background = initialState === 'search' ? '#2d2d2d' : '#1b1b1b';
  favoriteTab.style.background = initialState === 'favorite' ? '#2d2d2d' : '#1b1b1b';

  const handleClick = (tabName) => {
    searchTab.style.background = tabName === 'search' ? '#2d2d2d' : '#1b1b1b';
    favoriteTab.style.background = tabName === 'favorite' ? '#2d2d2d' : '#1b1b1b';
    onClick(tabName);
  };

  searchTab.addEventListener('click', () => handleClick('search'));
  favoriteTab.addEventListener('click', () => handleClick('favorite'));
}