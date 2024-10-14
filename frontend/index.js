import { backend } from 'declarations/backend';

let quill;

document.addEventListener('DOMContentLoaded', async () => {
  feather.replace();
  
  quill = new Quill('#editor', {
    theme: 'snow'
  });

  const newPostBtn = document.getElementById('newPostBtn');
  const postForm = document.getElementById('postForm');
  const submitPost = document.getElementById('submitPost');
  const postsContainer = document.getElementById('posts');

  newPostBtn.addEventListener('click', () => {
    postForm.style.display = 'block';
  });

  submitPost.addEventListener('click', async () => {
    const title = document.getElementById('postTitle').value;
    const author = document.getElementById('postAuthor').value;
    const body = quill.root.innerHTML;

    if (title && author && body) {
      showSpinner();
      try {
        await backend.addPost(title, body, author);
        postForm.style.display = 'none';
        document.getElementById('postTitle').value = '';
        document.getElementById('postAuthor').value = '';
        quill.setContents([]);
        await loadPosts();
      } catch (error) {
        console.error('Error submitting post:', error);
      } finally {
        hideSpinner();
      }
    }
  });

  await loadPosts();
});

async function loadPosts() {
  showSpinner();
  try {
    const posts = await backend.getPosts();
    const postsContainer = document.getElementById('posts');
    postsContainer.innerHTML = '';
    posts.forEach(post => {
      const postElement = document.createElement('div');
      postElement.className = 'post';
      postElement.innerHTML = `
        <h2>${post.title}</h2>
        <p class="author">By ${post.author}</p>
        <div class="post-body">${post.body}</div>
        <p class="timestamp">${new Date(Number(post.timestamp) / 1000000).toLocaleString()}</p>
      `;
      postsContainer.appendChild(postElement);
    });
  } catch (error) {
    console.error('Error loading posts:', error);
  } finally {
    hideSpinner();
  }
}

function showSpinner() {
  document.getElementById('loadingSpinner').style.display = 'flex';
}

function hideSpinner() {
  document.getElementById('loadingSpinner').style.display = 'none';
}
