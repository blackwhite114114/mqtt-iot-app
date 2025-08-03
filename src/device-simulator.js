const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://localhost:1883');

client.on('connect', () => {
  console.log('Device Simulator Connected');
  // 订阅命令主题
  client.subscribe('devices/sensor1/command', (err) => {
    if (!err) {
      console.log('Subscribed to command topic');
    }
  });
  
  setInterval(() => {
    const data = { temperature: Math.random() * 30, humidity: Math.random() * 100 };
    client.publish('devices/sensor1/status', JSON.stringify(data));
    console.log('Sent data:', data);
  }, 5000); // 每5秒发送
});

// 处理从服务器收到的命令
client.on('message', (topic, message) => {
  if (topic === 'devices/sensor1/command') {
    const command = JSON.parse(message.toString());
    console.log('Received command:', command);
    
    // 根据命令执行相应操作
    switch (command.command) {
      case 'getStatus':
        // 立即发送当前状态
        const data = { temperature: Math.random() * 30, humidity: Math.random() * 100 };
        client.publish('devices/sensor1/status', JSON.stringify(data));
        console.log('Sent immediate status update:', data);
        break;
      case 'setInterval':
        // 这里可以实现更新发送间隔的逻辑
        console.log('Received interval update command:', command);
        break;
      default:
        console.log('Unknown command:', command.command);
    }
  }
});