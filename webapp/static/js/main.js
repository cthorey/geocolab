function onchange(e) {
    if (e.currentTarget.value === 'refresh') {
        window.location.reload();
    }
}

document.getElementById('search_type').addEventListener('change', onchange);
