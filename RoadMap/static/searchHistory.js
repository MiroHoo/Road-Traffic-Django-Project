async function saveSearchQuery(query) {
    if (!query || typeof query !== 'string') {
      console.error("Invalid query received:", query);
      return;
    }
  
    const csrfToken = getCookie('csrftoken');
  
    try {
      const response = await fetch("http://127.0.0.1:8000/search/save-search/", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken
        },
        body: JSON.stringify({ query: query }),
        mode: 'same-origin',
      });
  
      const data = await response.json();
      if (data.status === "success") {
        console.log("Search query saved successfully!");
      } else {
        console.error("Failed to save search query:", data.message);
      }
    } catch (error) {
      console.error("Error saving search query:", error);
    }
  }

  async function loadSearchHistory() {
    const csrfToken = getCookie('csrftoken');
    await fetch("http://127.0.0.1:8000/search/search-history/", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
        },
        mode: 'same-origin',
    })
    .then((response) => response.json())
    .then((data) => {
        console.log("Search History:", data.history);
        displaySearchHistory(data.history);
    })
    .catch((error) => console.error("Error loading search history:", error));
}

function displaySearchHistory(history) {
  const historyContainer = document.getElementById('search-history');
  historyContainer.innerHTML = '';

  if (history.length === 0) {
      historyContainer.innerHTML = '<p>No search history available.</p>';
      return;
  }

  const formatDate = (dateString) => {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
  };

  const formatTime = (dateString) => {
      const date = new Date(dateString);
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
  };

  const groupedHistory = groupHistoryByDate(history);

  for (let date in groupedHistory) {
      const formattedDate = formatDate(date);
      const dateHeader = document.createElement('h3');
      dateHeader.textContent = `Searches on ${formattedDate}`;
      historyContainer.appendChild(dateHeader);

      const dayHistory = groupedHistory[date];
      dayHistory.forEach(item => {
          const historyItem = document.createElement('div');
          historyItem.classList.add('history-item');
          const formattedTime = formatTime(item.timestamp);
          historyItem.textContent = `${item.query} (Searched at: ${formattedTime})`;
          historyItem.addEventListener('click', function () {
              console.log(`Clicked on: ${item.query}`);
          });
          historyContainer.appendChild(historyItem);
      });
  }
}


function groupHistoryByDate(history) {
    const grouped = {};

    history.forEach(item => {
        const date = new Date(item.timestamp).toISOString().split('T')[0];

        if (!grouped[date]) {
            grouped[date] = [];
        }
        grouped[date].push(item);
    });

    return grouped;
}

function openSearchHistory() {
    document.getElementById('searchHistoryModal').style.display = "block";
    loadSearchHistory();
}

function closeSearchHistoryModal() {
    document.getElementById('searchHistoryModal').style.display = "none";
}
