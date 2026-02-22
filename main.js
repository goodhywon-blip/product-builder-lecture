const form = document.getElementById('partner-form');
const statusEl = document.getElementById('form-status');
const submitBtn = form.querySelector('button[type="submit"]');

function setStatus(message, isError = false) {
    statusEl.textContent = message;
    statusEl.style.color = isError ? '#b3261e' : '';
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    submitBtn.disabled = true;
    setStatus('전송 중입니다...');

    try {
        const formData = new FormData(form);
        const response = await fetch(form.action, {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            },
            body: formData
        });

        if (response.ok) {
            form.reset();
            setStatus('문의가 정상적으로 접수되었습니다. 곧 연락드릴게요!');
        } else {
            const data = await response.json().catch(() => null);
            const errorMessage = data?.errors?.[0]?.message || '전송에 실패했습니다. 다시 시도해주세요.';
            setStatus(errorMessage, true);
        }
    } catch (error) {
        setStatus('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.', true);
    } finally {
        submitBtn.disabled = false;
    }
});
