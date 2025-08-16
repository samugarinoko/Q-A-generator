document.addEventListener('DOMContentLoaded', () => {
    // ボタンのIDを正確に指定して要素を取得
    const addNewButton = document.getElementById('addNewButton');
    const inputContainer = document.getElementById('inputContainer');
    const preview = document.getElementById('preview');
    const generateButton = document.getElementById('generateButton');
    const codeOutput = document.getElementById('codeOutput');
    
    // 最初の入力フィールドセットを追加
    addInputFields();

    // 「新しいQ&Aを追加」ボタンのイベントリスナー
    addNewButton.addEventListener('click', () => {
        addInputFields();
        updatePreview();
    });

    // 入力フィールドの削除ボタンのイベントリスナー（イベント委譲）
    inputContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-button')) {
            event.target.closest('.input-item').remove();
            updatePreview(); // プレビューも更新
        }
    });

    // 質問と答えの入力フィールドの変更を監視してプレビューを更新
    inputContainer.addEventListener('input', updatePreview);

    // コード生成ボタンのイベントリスナー
    generateButton.addEventListener('click', generateCode);

    function addInputFields() {
        const inputItem = document.createElement('div');
        inputItem.classList.add('input-item');
        inputItem.innerHTML = `
            <label>質問:</label>
            <input type="text" class="question-input" placeholder="質問を入力">
            <label>答え:</label>
            <input type="text" class="answer-input" placeholder="答えを入力">
            <button class="remove-button">削除</button>
        `;
        inputContainer.appendChild(inputItem);
    }

    function updatePreview() {
        const qnaData = getQnADataFromInputs();
        preview.innerHTML = '';
        if (qnaData.length === 0) {
            preview.innerHTML = '<p style="text-align: center; color: #888;">ここにQ&Aが表示されます</p>';
        } else {
            qnaData.forEach((item) => {
                const qnaDiv = document.createElement('div');
                qnaDiv.classList.add('question-item');
                qnaDiv.innerHTML = `
                    <span>Q: ${item.question}</span>
                    <button class="remove-button">削除</button>
                `;
                preview.appendChild(qnaDiv);
            });
        }
    }
    
    function getQnADataFromInputs() {
        const inputs = document.querySelectorAll('.input-item');
        const data = [];
        inputs.forEach(item => {
            const question = item.querySelector('.question-input').value.trim();
            const answer = item.querySelector('.answer-input').value.trim();
            if (question && answer) {
                data.push({ question, answer });
            }
        });
        return data;
    }

    function generateCode() {
        const qnaData = getQnADataFromInputs();
        if (qnaData.length === 0) {
            alert('Q&Aを最低1つ入力してください。');
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
    }
});
