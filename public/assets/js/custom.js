$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

$(".select2").select2({
    //theme: 'bootstrap'
    width: '100%'
}).on('select2:open', function () {
    $('.select2-search__field').attr('placeholder', 'Search here');
});

$(".input-mask").inputmask();

// notification modal
$('.show-notification-detail').on('click', function () {
    let element = $(this)
    let url = element.attr('data-read-url')
    let title = element.attr('data-title')
    let description = element.attr('data-description')
    let photo = element.attr('data-photo')
    let html = '';

    if (photo) {
        html = '<img src="' + photo + '" class="img-fluid rounded-3 mb-3 d-block mx-auto"/>'
    }

    html += '<h3 class="text-center text-body">' + title + '</h3>';
    html += '<p class="text-gray text-center">' + description + '</p>'

    $("#notification-modal-body").html(html)

    new bootstrap.Modal('#notification-modal').show()

    $.ajax({
        url: url, method: 'post', dataType: 'json', success: function () {
            element.find('.notification-dot').remove()
        }
    })
})

// ask for confirmation
$(document).on('click', '.confirm-button', function (e) {
    e.preventDefault();
    let url = $(this).attr('href')
    let title = $(this).attr('data-title') || "Are you sure?"
    let text = $(this).attr('data-text') || ""
    let icon = "warning"
    let confirmButtonText = $(this).attr('data-confirm-button') || "Proceed"
    let cancelButtonText = $(this).attr('data-cancel-button') || "Cancel"

    showConfirmation(title, text, icon, confirmButtonText, cancelButtonText)
        .then(function (result) {
            if (result.isConfirmed) location.replace(url);
        });
});

// ask for confirmation
$(document).on('click', '.confirm-action', function (e) {
    e.preventDefault();
    let form = $(this).parents('form');
    let title = $(this).attr('data-title') || "Are you sure to proceed?"
    let text = $(this).attr('data-text') || "You can not undo this process"
    let icon = "warning"
    let confirmButtonText = $(this).attr('data-confirm-button') || "Proceed"
    let cancelButtonText = $(this).attr('data-cancel-button') || "Cancel"

    showConfirmation(title, text, icon, confirmButtonText, cancelButtonText)
        .then(function (result) {
            if (result.isConfirmed) form.submit();
        });
});

// ask for confirmation
$(document).on('click', '.delete-confirm', function (e) {
    e.preventDefault();
    let form = $(this).parents('form');

    let title = $(this).attr('data-title') || "Are you sure to delete?"
    let text = $(this).attr('data-text') || "You can not undo this process"
    let icon = "warning"
    let confirmButtonText = $(this).attr('data-confirm-button') || "Delete"
    let cancelButtonText = $(this).attr('data-cancel-button') || "Cancel"

    showConfirmation(title, text, icon, confirmButtonText, cancelButtonText)
        .then(function (result) {
            if (result.isConfirmed) form.submit();
        });
});

function showConfirmation(title, text, icon, confirmButtonText, cancelButtonText) {
    return Swal.fire({
        title: title,
        text: text,
        icon: icon,
        showCancelButton: true,
        confirmButtonText: confirmButtonText,
        cancelButtonText: cancelButtonText,
        confirmButtonColor: '#D71920',
        cancelButtonColor: '#266EF1',
    })
}

/**
 *
 * File Upload & Image Resize
 *
 */
$(".file-uploader").each(function (key, dropzone) {
    let dropzoneElement = $(dropzone)
    let dropzoneTargetElement = $($(dropzone).attr('data-target'))
    let dropzoneFileInput = $("<input type='file' name='file_uploader_" + key + "_file' accept='image/*' />")

    dropzoneElement.on('click', '.file-uploader-browse', function () {
        dropzoneFileInput.trigger('click')
    })

    dropzoneElement.on('drop', function (e) {
        e.preventDefault()
        e.stopPropagation()

        if (e.originalEvent.dataTransfer.items) {
            let item = e.originalEvent.dataTransfer.items[0]
            // If dropped items aren't files, reject them
            if (item.kind === 'file') {
                resizeImage(item.getAsFile(), dropzoneElement, dropzoneTargetElement)
            }
        } else {
            // Use DataTransfer interface to access the file(s)
            let file = e.originalEvent.dataTransfer.files[0]
            resizeImage(file, dropzoneElement, dropzoneTargetElement)
        }
    })

    dropzoneElement.on('dragover', function (e) {
        e.preventDefault()
        e.stopPropagation()
    })

    dropzoneElement.on('click', '.file-uploader-remove', function () {
        let deleteLink = $(this).attr('data-delete-link');
        if (deleteLink) {
            let title = "Are you sure to delete?"
            let text = "You can not undo this process"
            let icon = "warning"
            let confirmButtonText = "Delete"
            let cancelButtonText = "Cancel"

            showConfirmation(title, text, icon, confirmButtonText, cancelButtonText)
                .then(function (result) {
                    if (result.isConfirmed) {
                        $.ajax({
                            url: deleteLink, method: 'delete', dataType: 'json', success: function (response) {
                                if (response.status_code === 200) {
                                    removeImage(dropzoneTargetElement, dropzoneFileInput, dropzoneElement)
                                } else {
                                    Swal.fire({
                                        title: "Sorry! Something went wrong",
                                        text: response.message,
                                        icon: "error",
                                        showCancelButton: false,
                                        showConfirmButton: false,
                                    })
                                }
                            }, error: function (request, status, error) {
                                Swal.fire({
                                    title: "Sorry! Something went wrong",
                                    text: error,
                                    icon: "error",
                                    showCancelButton: false,
                                    showConfirmButton: false,
                                })
                            }
                        })
                    }
                });
        } else {
            removeImage(dropzoneTargetElement, dropzoneFileInput, dropzoneElement)
        }
    })

    dropzoneFileInput.on('change', function (event) {
        if (event.target.files.length > 0) {
            resizeImage(event.target.files[0], dropzoneElement, dropzoneTargetElement)
        }
    })

    function resizeImage(imageFile, dropzoneElement, dropzoneTargetElement) {

        let reader = new FileReader()
        reader.onload = function (e) {
            let img = document.createElement("img")
            img.onload = function () {

                let MAX_WIDTH = 1200
                let MAX_HEIGHT = 675

                let width = img.width
                let height = img.height

                // Change the resizing logic
                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height = height * (MAX_WIDTH / width)
                        width = MAX_WIDTH
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width = width * (MAX_HEIGHT / height)
                        height = MAX_HEIGHT
                    }
                }

                // Dynamically create a canvas element
                let canvas = document.createElement("canvas");
                canvas.width = width
                canvas.height = height

                let ctx = canvas.getContext("2d")
                ctx.drawImage(img, 0, 0, width, height)

                // Show resized image in preview element
                let imageDataUrl = canvas.toDataURL(imageFile.type, 0.75);
                dropzoneElement.find('.file-uploader-preview img[data-file-uploader-thumbnail]')[0].src = imageDataUrl
                dropzoneElement.addClass('show-preview')

                dropzoneTargetElement.val(imageDataUrl)
            }
            img.src = e.target.result
        }
        reader.readAsDataURL(imageFile)
    }

    function removeImage(dropzoneTargetElement, dropzoneFileInput, dropzoneElement) {
        dropzoneTargetElement.val('')
        dropzoneFileInput.val('')
        dropzoneElement.removeClass('show-preview')
    }
})
