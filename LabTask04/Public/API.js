$(document).ready(function() {
  const API_URL = "https://jsonplaceholder.typicode.com/posts";

  // ---------- Show Loading ----------
  function showLoading() {
    $("#loading").show();
  }
  function hideLoading() {
    $("#loading").hide();
  }

  // ---------- READ ----------
  function loadPosts() {
    showLoading();
    $.get(API_URL, function(posts) {
      hideLoading();
      const tbody = $("#postsTable tbody");
      tbody.empty();
      posts.slice(0, 10).forEach(post => { // limit to 10 for demo
        tbody.append(`
          <tr data-id="${post.id}">
            <td>${post.id}</td>
            <td>${post.title}</td>
            <td>${post.body}</td>
            <td>
              <button class="btn btn-sm btn-warning editBtn"><i class="fa fa-edit"></i> Edit</button>
              <button class="btn btn-sm btn-danger deleteBtn"><i class="fa fa-trash"></i> Delete</button>
            </td>
          </tr>
        `);
      });
    }).fail(function() {
      hideLoading();
      alert("Failed to load posts.");
    });
  }

  loadPosts();

  // ---------- CREATE / UPDATE ----------
  $("#postForm").submit(function(e) {
    e.preventDefault();
    const id = $("#postId").val();
    const data = {
      title: $("#title").val(),
      body: $("#body").val(),
      userId: 1
    };

    if (id) {
      // UPDATE
      $.ajax({
        url: `${API_URL}/${id}`,
        method: "PUT",
        data: data,
        beforeSend: showLoading,
        success: function(updatedPost) {
          hideLoading();
          alert("Post updated successfully!");
          loadPosts();
          resetForm();
        },
        error: function() {
          hideLoading();
          alert("Failed to update post.");
        }
      });
    } else {
      // CREATE
      $.ajax({
        url: API_URL,
        method: "POST",
        data: data,
        beforeSend: showLoading,
        success: function(newPost) {
          hideLoading();
          alert("Post added successfully!");
          loadPosts();
          resetForm();
        },
        error: function() {
          hideLoading();
          alert("Failed to add post.");
        }
      });
    }
  });

  // ---------- EDIT ----------
  $(document).on("click", ".editBtn", function() {
    const row = $(this).closest("tr");
    const id = row.data("id");
    const title = row.find("td:eq(1)").text();
    const body = row.find("td:eq(2)").text();

    $("#postId").val(id);
    $("#title").val(title);
    $("#body").val(body);
    $("#formTitle").text("Edit Post");
  });

  // ---------- CANCEL EDIT ----------
  $("#cancelEdit").click(function() {
    resetForm();
  });

  function resetForm() {
    $("#postForm")[0].reset();
    $("#postId").val("");
    $("#formTitle").text("Add New Post");
  }

  // ---------- DELETE ----------
  $(document).on("click", ".deleteBtn", function() {
    const row = $(this).closest("tr");
    const id = row.data("id");
    if (confirm("Are you sure you want to delete this post?")) {
      $.ajax({
        url: `${API_URL}/${id}`,
        method: "DELETE",
        beforeSend: showLoading,
        success: function() {
          hideLoading();
          alert("Post deleted successfully!");
          row.remove();
        },
        error: function() {
          hideLoading();
          alert("Failed to delete post.");
        }
      });
    }
  });
});
