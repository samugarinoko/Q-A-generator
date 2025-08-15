document.addEventListener('DOMContentLoaded', () => {
    const questionInput = document.getElementById('question');
    const answerInput = document.getElementById('answer');
    const addButton = document.getElementById('add-button');
    const previewContainer = document.getElementById('preview-container');
    const outputCodeTextarea = document.getElementById('output-code');
    const copyButton = document.getElementById('copy-button');

    const qaData = [];

    // Q&A項目を追加する関数
    function addQaItem(question, answer) {
        qaData.push({ question, answer });
        updatePreview();
    }

    // プレビューを更新する関数
    function updatePreview() {
        previewContainer.innerHTML = ''; // プレビューをクリア

        qaData.forEach((item, index) => {
            const qaItem = document.createElement('div');
            qaItem.className = 'qa-item';
            qaItem.dataset.index = index; // 削除用にインデックスを保存

            qaItem.innerHTML = `
                <div class="question-row">
                    <span class="qa-label q-label">Q</span>
                    <p class="question-text">${item.question}</p>
                    <button class="toggle-button">+</button>
                </div>
                <div class="answer-row">
                    <span class="qa-label a-label">A</span>
                    <p class="answer-text">${item.answer}</p>
                </div>
                <button class="remove-button">×</button>
            `;
            
            previewContainer.appendChild(qaItem);
        });

        // プレビュー表示後のイベントリスナー再設定
        addEventListenersToPreview();
        generateCode();
    }

    // プレビュー内のイベントリスナーを設定する関数
    function addEventListenersToPreview() {
        document.querySelectorAll('.qa-item').forEach(item => {
            // トグルボタンのクリックイベント
            const questionRow = item.querySelector('.question-row');
            const answerRow = item.querySelector('.answer-row');
            const toggleButton = item.querySelector('.toggle-button');

            questionRow.addEventListener('click', () => {
                const isVisible = answerRow.classList.contains('visible');
                if (isVisible) {
                    answerRow.classList.remove('visible');
                    toggleButton.classList.remove('expanded');
                    toggleButton.textContent = '+';
                } else {
                    answerRow.classList.add('visible');
                    toggleButton.classList.add('expanded');
                    toggleButton.textContent = '×';
                }
            });

            // 削除ボタンのクリックイベント
            const removeButton = item.querySelector('.remove-button');
            removeButton.addEventListener('click', (e) => {
                e.stopPropagation(); // 親要素へのイベント伝播を停止
                const index = parseInt(item.dataset.index);
                qaData.splice(index, 1);
                updatePreview();
            });
        });
    }

    // HTMLコードを生成する関数
    function generateCode() {
        let code = '';
        qaData.forEach(item => {
            code += `
        <div class="qa-item">
            <div class="question-row">
                <span class="qa-label q-label">Q</span>
                <p class="question-text">${item.question}</p>
                <button class="toggle-button">+</button>
            </div>
            <div class="answer-row">
                <span class="qa-label a-label">A</span>
                <p class="answer-text">${item.answer}</p>
            </div>
        </div>`;
        });
        
        outputCodeTextarea.value = `<div class="qa-container">${code}
</div>`;
    }

    // 「Q&Aを追加」ボタンのクリックイベント
    addButton.addEventListener('click', () => {
        const question = questionInput.value.trim();
        const answer = answerInput.value.trim();

        if (question && answer) {
            addQaItem(question, answer);
            questionInput.value = ''; // 入力欄をクリア
            answerInput.value = '';
        } else {
            alert('質問と答えの両方を入力してください。');
        }
    });

    // 「コードをコピー」ボタンのクリックイベント
    copyButton.addEventListener('click', () => {
        outputCodeTextarea.select();
        document.execCommand('copy');
        alert('コードがコピーされました！');
    });

    // 初期表示のために、一度更新処理を実行
    updatePreview();
});
