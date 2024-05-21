/**
 * @description 검색, 즐겨찾기
 * @param initialState tabButton
 * @param onClick
 */

export default function TabButton({initialState, onClick}){

  this.state = initialState

  const searchTab = document.getElementById('search')
  const favoriteTab = document.getElementById('favorite')


  const handleClick = (tabName) => {
    onClick(tabName);
  };

  searchTab.addEventListener('click', () => handleClick('search'));
  favoriteTab.addEventListener('click', () => handleClick('favorite'));
}