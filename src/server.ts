import app from './app';

const PORT = process.env.PORT || 5000;

function main() {
  try {
    app.listen(PORT, () => {
      console.log(`🚀 GearUp Core Engine Server responding cleanly on port: ${PORT}`);
    });
  } catch (error) {
    console.error('🛑 Core Bootstrap system failure detected:', error);
    process.exit(1);
  }
}

main();