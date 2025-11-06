// play music functionality
function playMusic() {
  const buttonMusic = document.getElementById("myAudio");
  buttonMusic.play();
}

const audio = new Audio("spooky-sound.mp3");
audio.play();

// drag and drop functionality
let draggedElement = null;

// add drag event listeners to all movie items
function initializeDragAndDrop() {
  const movieItems = document.querySelectorAll('.message');
  
  movieItems.forEach(item => {
    item.setAttribute('draggable', 'true');
    
    item.addEventListener('dragstart', function(e) {
      draggedElement = this;
      this.style.opacity = '0.5';
    });
    
    item.addEventListener('dragend', function(e) {
      this.style.opacity = '1';
    });
  });

  // add drop zones
  const dropZones = document.querySelectorAll('.kanban-column');
  
  dropZones.forEach(zone => {
    zone.addEventListener('dragover', function(e) {
      e.preventDefault();
      this.classList.add('drag-over');
    });
    
    zone.addEventListener('dragleave', function(e) {
      this.classList.remove('drag-over');
    });
    
    zone.addEventListener('drop', function(e) {
      e.preventDefault();
      this.classList.remove('drag-over');
      
      if (draggedElement) {
        const movieList = this.querySelector('.messages');
        const name = draggedElement.querySelector('.title').innerText;
        const msg = draggedElement.querySelector('.year').innerText;
        const status = this.dataset.status;
        
        // update the status in database
        fetch('/messages/status', {
          method: 'put',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name,
            msg: msg,
            status: status
          })
        })
        .then(response => {
          if (response.ok) return response.json();
        })
        .then(data => {
          console.log(data);
          window.location.reload(true);
        })
        .catch(err => console.error(err));
      }
    });
  });
}

// initialize on page load
document.addEventListener('DOMContentLoaded', initializeDragAndDrop);