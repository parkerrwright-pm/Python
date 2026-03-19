let expression = '';

function appendNumber(num) {
    expression += num;
    updateDisplay();
}

function appendOperator(op) {
    if (expression === '') return;
    
    // Prevent multiple operators in a row
    if ('+-*/%'.includes(expression.slice(-1))) {
        expression = expression.slice(0, -1) + op;
    } else {
        expression += op;
    }
    updateDisplay();
}

function deleteLast() {
    expression = expression.slice(0, -1);
    updateDisplay();
}

function clearDisplay() {
    expression = '';
    document.getElementById('result').value = '';
    document.getElementById('expression').value = '';
    updateStatus('Ready');
}

function updateDisplay() {
    document.getElementById('expression').value = expression;
}

async function calculate() {
    if (expression === '') return;
    
    try {
        updateStatus('Calculating...');
        
        const response = await fetch('/api/calc', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ expression: expression })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Format result to avoid floating point display issues
            let result = data.result;
            if (Number.isInteger(result)) {
                document.getElementById('result').value = result;
            } else {
                // Round to 10 decimal places to avoid floating point errors
                result = Math.round(result * 10000000000) / 10000000000;
                document.getElementById('result').value = result;
            }
            
            expression = String(data.result);
            updateStatus('Ready');
        } else {
            updateStatus('Error: ' + data.detail);
            document.getElementById('result').value = 'Error';
        }
    } catch (error) {
        updateStatus('Error: ' + error.message);
        document.getElementById('result').value = 'Error';
    }
}

function updateStatus(message) {
    document.getElementById('status').textContent = message;
}

// Allow Enter key to calculate
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        calculate();
    } else if (event.key === 'Escape') {
        clearDisplay();
    } else if (event.key === 'Backspace') {
        event.preventDefault();
        deleteLast();
    } else if (event.key === '.') {
        event.preventDefault();
        appendNumber('.');
    } else if (event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/') {
        event.preventDefault();
        appendOperator(event.key);
    } else if (event.key === '%') {
        event.preventDefault();
        appendOperator('%');
    } else if (event.key >= '0' && event.key <= '9') {
        event.preventDefault();
        appendNumber(event.key);
    }
});