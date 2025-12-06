# Test Scripts

## test-roast.ts

Automated test script that runs the full roast generation process with comprehensive logging.

### Features

- ✅ Runs the complete roast generation pipeline
- 📊 Logs all phases and steps with timestamps
- 💾 Saves results to `/log` folder in multiple formats:
  - `roast-{timestamp}.json` - Full roast result
  - `test-{timestamp}.log.json` - Complete test log with metadata
  - `test-{timestamp}.log.txt` - Human-readable log file

### Usage

1. **Install dependencies** (if not already installed):
   ```bash
   npm install
   ```

2. **Set up environment variable**:
   Make sure you have `NEXT_PUBLIC_CONVEX_URL` in your `.env.local` file:
   ```bash
   NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
   ```

3. **Run the test**:
   ```bash
   npm run test:roast
   ```
   
   Or directly:
   ```bash
   npx tsx scripts/test-roast.ts
   ```

### Sample Idea

The test uses a sample idea based on "whyyourideasucks.ai" itself:
- **Pitch**: A platform that uses AI to brutally evaluate startup ideas
- **Category**: B2B/SaaS
- **Stage**: MVP built
- **Brutality**: honest

### Output

The script will:
1. Connect to your Convex deployment
2. Generate a full roast with all 6 roaster agents
3. Generate mentor suggestions
4. Generate synthesis and fixes
5. Save all results to the `/log` folder

### Example Output

```
🚀 Starting Roast Generation Test
============================================================
📝 Testing Idea: whyyourideasucks.ai - A platform that uses AI to brutally evaluate...
============================================================

🔄 [PHASE_1] generateRoast start
✅ [PHASE_1] generateRoast success (45230ms)
   Data: {"duration":45230,"verdict":"...","scores":["market","distribution",...]}

============================================================
✅ TEST COMPLETED SUCCESSFULLY
============================================================
⏱️  Total Duration: 45230ms (45.23s)
📊 Verdict: Nice side project, weak as a venture-scale startup until X and Y are solved.
📈 Average Score: 5.2/10
💡 Pivots Generated: 3
📅 Action Items: 7
📁 Results saved to: log/roast-1234567890.json
📋 Full log saved to: log/test-1234567890.log.json
============================================================
```

### Troubleshooting

- **Error: NEXT_PUBLIC_CONVEX_URL not set**
  - Add it to your `.env.local` file or export it: `export NEXT_PUBLIC_CONVEX_URL='https://...'`

- **Error: Connection failed**
  - Make sure your Convex deployment is running
  - Check that the URL is correct

- **Error: Action not found**
  - Make sure you've deployed your Convex functions: `npx convex deploy`

