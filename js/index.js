// will do dynamic stuff and data here

const cryptoLink = "https://api.coingecko.com/api/v3/exchange_rates";
//the bombaclaat data
const getData = fetch(cryptoLink)
  .then((response) => response.json())
  .then((data) => data.rates);

const ratesObjToHtml = (obj) => {
  const entries = Object.entries(obj);
  const ulElement = document.createElement("ul");
  ulElement.className = "crypto-list";

  for (const [key, value] of entries) {
    const liElement = document.createElement("li");
    liElement.className = 'item';
    liElement.innerHTML = `<strong>${key}:</strong> ${value.name} - ${value.value}`;
    ulElement.appendChild(liElement);
  }

  return ulElement;
};

//wait for page to load
document.addEventListener("DOMContentLoaded", () => {
  const cryptoContainer = document.getElementById("listCoin");
  const favs = document.getElementById('favorites');
 
  //move shit from one container to another 
  const updateCollections = (item, direction) => {
    if (direction === 'toFavs') {
      item.classList.add('item');
      favs.appendChild(item);
    } else if (direction === 'toMain') {
      cryptoContainer.appendChild(item);
      item.classList.add('item');
    }
  }


  cryptoContainer.addEventListener('click', function (event) {
    const clickedItem = event.target.closest('.item');
    if (clickedItem) {
      let direction = 'toFavs';
      updateCollections(clickedItem, direction);
    }
  });


  favs.addEventListener('click', function (event) {
    const clickedItem = event.target.closest('.item');
    if (clickedItem) {
      let direction = 'toMain';
      updateCollections(clickedItem, direction);
    }
  });

  getData.then((rates) => {
    const ratesHtml = ratesObjToHtml(rates);
    cryptoContainer.appendChild(ratesHtml);
  });


  //some variables for sorting the stuff
  const sortBtn = document.querySelectorAll('.sortBtn');

  //sort data function  
  const sortData = (direction) => {
    const mainContainer = document.getElementById('listCoin');
    const newCoinListArr = Array.from(mainContainer.querySelectorAll('.item'));

    newCoinListArr.sort((a, b) => {
      const aValue = a.textContent.trim().toLowerCase();
      const bValue = b.textContent.trim().toLowerCase();

      if (direction === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

    newCoinListArr.forEach((item) => {
      mainContainer.appendChild(item);
    });
  }


  for (let i = 0; i < sortBtn.length; i+=1) {
    sortBtn[i].addEventListener('click', function() {
        const sortedDirect = sortBtn[i].dataset.sortdir;
        sortData(sortedDirect);
        console.log(sortedDirect);
    })
  }



  /*the current time is 12:12pm EST and im going braindead
  already after two cups of coffee. i dont feel like
  using my brain so im just gonna copy and paste the above stuff nd
  tweak it so i can do it for  the favorites container */
  //some variables for sorting the stuff
  const sortFavs = document.querySelectorAll('.sortFavs');

  //sort data function  
  const sortFavData = (direction) => {
    const mainFavContainer = document.getElementById('favorites');
    const newFavListArr = Array.from(mainFavContainer.querySelectorAll('.item'));

    newFavListArr.sort((a, b) => {
      const aValue = a.textContent.trim().toLowerCase();
      const bValue = b.textContent.trim().toLowerCase();

      if (direction === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

    newFavListArr.forEach((item) => {
      mainFavContainer.appendChild(item);
    });
  }


  for (let i = 0; i < sortFavs.length; i+=1) {
    sortFavs[i].addEventListener('click', function() {
        const sortedDirect = sortFavs[i].dataset.sortdir;
        sortFavData(sortedDirect);
        console.log(sortedDirect);
    })
  }



  //get total of type (fiat currency / coins)
  getData.then((coins) => {
    let cryptoSum = 0;

    for (const key in coins) {
      if (coins[key].type === 'crypto') {
        cryptoSum += parseInt(coins[key].value);
      }
    }
    const getTotalContainer = document.getElementById('total');
    getTotalContainer.innerText = `Total amount of coins in circulation: ${cryptoSum}`
  })

  getData.then((cash) => {
    let sum = 0;

    for (const key in cash) {
      if (cash[key].type === 'fiat') {
        sum += parseInt(cash[key].value);
      }
    }
    const getTotalCashContainer = document.getElementById('total-cash');
    getTotalCashContainer.innerText = `Total amount of fiat (cash) in circulation: ${sum}`
  })
});

