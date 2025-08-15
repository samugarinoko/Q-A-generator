document.addEventListener('DOMContentLoaded', () => {
    const questionInput = document.getElementById('questionInput');
    const answerInput = document.getElementById('answerInput');
    const addButton = document.getElementById('addButton');
    const preview = document.getElementById('preview');
    const generateButton = document.getElementById('generateButton');
    const codeOutput = document.getElementById('codeOutput');
    
    let qnaData = [];

    // 追加ボタンのクリックイベント
    addButton.addEventListener('click', () => {
        const question = questionInput.value.trim();
        const answer = answerInput.value.trim();
        if (question && answer) {
            qnaData.push({ question, answer });
            updatePreview();
            questionInput.value = '';
            answerInput.value = '';
        }
    });

    // プレビュー内の削除ボタンのクリックイベント（イベント委譲を使用）
    preview.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-button')) {
            const index = event.target.dataset.index;
            removeQnA(index);
        }
    });

    // コード生成ボタンのクリックイベント
    generateButton.addEventListener('click', () => {
        if (qnaData.length === 0) {
            alert('Q&Aを最低1つ追加してください。');
            return;
        }

        const styleCode = `
<style>
.qa-container {
    max-width: 600px;
    margin: 20px auto;
}
.qa-item {
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    overflow: hidden;
}
.question-box {
    background-color: #ADD8E6;
    color: white;
    padding: 15px;
    display: flex;
    align-items: center;
    position: relative;
    cursor: pointer;
}
.q-label {
    font-weight: bold;
    padding-right: 10px;
}
.toggle-button {
    position: absolute;
    top: 50%;
    right: 15px;
    transform: translateY(-50%);
    width: 25px;
    height: 25px;
    border-radius: 50%;
    border: 1px solid #00BFFF;
    color: #00BFFF;
    background-color: white;
    font-size: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: transform 0.3s ease-in-out;
}
.answer-box {
    background-color: #FFB6C1;
    color: white;
    padding: 0 15px;
    display: flex;
    align-items: center;
    overflow: hidden;
    max-height: 0;
    opacity: 0;
    transition: max-height 0.5s ease-in-out, padding 0.5s ease-in-out, opacity 0.5s ease-in-out;
}
.a-label {
    font-weight: bold;
    padding-right: 10px;
}
.qa-item.expanded .answer-box {
    max-height: 200px; /* 答えの高さに合わせて調整 */
    padding: 15px;
    opacity: 1;
}
.qa-item.expanded .toggle-button {
    transform: translateY(-50%) rotate(45deg);
}
</style>
`;
        let htmlCode = `
<div class="qa-container">
`;
        qnaData.forEach(item => {
            htmlCode += `
    <div class="qa-item">
        <div class="question-box">
            <span class="q-label">Q</span>
            <span>${item.question}</span>
            <button class="toggle-button">+</button>
        </div>
        <div class="answer-box">
            <span class="a-label">A</span>
            <span>${item.answer}</span>
        </div>
    </div>
`;
        });
        htmlCode += `
</div>
<script>
document.querySelectorAll('.question-box').forEach(button => {
    button.addEventListener('click', () => {
        const qaItem = button.closest('.qa-item');
        qaItem.classList.toggle('expanded');
    });
});
</script>
`;
        
        codeOutput.textContent = styleCode + htmlCode;
        codeOutput.style.display = 'block';
    });

    function removeQnA(index) {
        qnaData.splice(index, 1);
        updatePreview();
    }

    function updatePreview() {
        preview.innerHTML = '';
        if (qnaData.length === 0) {
            preview.innerHTML = '<p style="text-align: center; color: #888;">ここにQ&Aが表示されます</p>';
        } else {
            qnaData.forEach((item, index) => {
                const qnaDiv = document.createElement('div');
                qnaDiv.classList.add('question-item');
                qnaDiv.innerHTML = `
                    <span>Q: ${item.question}</span>
                    <button class="remove-button" data-index="${index}">削除</button>
                `;
                preview.appendChild(qnaDiv);
            });
        }
    }
});
