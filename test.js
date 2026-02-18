const BASE_URL = 'http://localhost:3000';

async function testChat(userId, message) {
  console.log(`\n[${userId}] User: ${message}`);
  
  const response = await fetch(`${BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, message })
  });
  
  const data = await response.json();
  console.log(`[${userId}] Agent: ${data.reply}`);
  
  return data;
}

async function runTests() {
  console.log('=== Hydration Agent Test Suite ===\n');
  
  try {
    await testChat('user1', 'I drank 2 glasses of water');
    
    await testChat('user1', 'How much water have I had today?');
    
    await testChat('user1', 'I drank 500ml');
    
    await testChat('user1', 'What is my current status?');
    
    await testChat('user1', 'Set my goal to 10 glasses');
    
    await testChat('user1', 'Remove 1 glass');
    
    await testChat('user2', 'I drank 1 liter of water');
    
    await testChat('user2', 'How am I doing?');
    
    console.log('\n=== All tests completed ===');
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

runTests();
