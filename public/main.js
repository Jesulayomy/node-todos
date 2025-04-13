var done = document.getElementsByClassName("done");
const trash = document.getElementsByClassName("fa-trash");


Array.from(done).forEach(function(element) {
  element.addEventListener('click', function() {
    const todo = this.parentNode.parentNode.childNodes[3].innerText
    const done = this.parentNode.parentNode.classList.contains('crossed') ? true : false;
    fetch('todos', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        todo,
        done
      })
    })
    .then(response => {
      if (response.ok) return response.json()
    })
    .then(data => {
      console.log(data)
      window.location.reload(true)
    })
  });
});

Array.from(trash).forEach(function(element) {
  element.addEventListener('click', function(){
    const todo = this.parentNode.parentNode.childNodes[3].innerText
    fetch('todos', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'todo': todo,
        // 'msg': msg
      })
    }).then(function (response) {
      window.location.reload()
    })
  });
});
