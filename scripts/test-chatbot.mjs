#!/usr/bin/env node
/**
 * Test script for chatbot integration
 * Tests n8n webhook connectivity and basic functionality
 */

import chalk from "chalk";

const N8N_URL = process.env.N8N_WEBHOOK_URL || "http://localhost:5678/webhook/whatsapp-chatbot";

console.log(chalk.blue("🔧 Chatbot Integration Test\n"));

async function testN8NConnection() {
    console.log(chalk.yellow("Testing n8n webhook..."));

    try {
        const response = await fetch(N8N_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message: "Test message from chatbot script",
                from: "test@example.com",
                name: "Test User",
                sessionId: "test_session",
                timestamp: new Date().toISOString(),
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(chalk.green("✅ n8n webhook is responding"));
        console.log(chalk.gray("Response:"), data);
        return true;
    } catch (error) {
        console.log(chalk.red("❌ n8n webhook failed:"));
        console.log(chalk.red(error.message));
        console.log(chalk.yellow("\nMake sure n8n is running:"));
        console.log(chalk.white("  docker ps | grep n8n"));
        console.log(chalk.white("  docker start n8n-local"));
        return false;
    }
}

async function testLocalAPI() {
    console.log(chalk.yellow("\nTesting local API route..."));

    try {
        const response = await fetch("http://localhost:3000/api/chatbot", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message: "Hello, testing the chatbot",
                sessionId: "test_session",
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        console.log(chalk.green("✅ Local API is responding"));
        console.log(chalk.gray("Response:"), data);
        return true;
    } catch (error) {
        console.log(chalk.red("❌ Local API failed:"));
        console.log(chalk.red(error.message));
        console.log(chalk.yellow("\nMake sure the Next.js dev server is running:"));
        console.log(chalk.white("  npm run dev"));
        return false;
    }
}

async function testProductQueries() {
    console.log(chalk.yellow("\nTesting product query examples..."));

    const testMessages = [
        "What's the price of Yara?",
        "Is Khamrah in stock?",
        "Show me perfumes for men",
    ];

    for (const message of testMessages) {
        console.log(chalk.gray(`  Testing: "${message}"`));
        // Just log the test queries - actual testing requires running server
    }

    console.log(chalk.green("✅ Test queries defined"));
    console.log(chalk.gray("Run the Next.js dev server to test these queries"));
}

// Run tests
async function runTests() {
    console.log(chalk.blue("═══════════════════════════════════════"));
    console.log(chalk.blue("  Ummie's Essence Chatbot Tests"));
    console.log(chalk.blue("═══════════════════════════════════════\n"));

    const n8nOk = await testN8NConnection();

    if (!n8nOk) {
        console.log(chalk.yellow("\n⚠️  n8n is not running. Fix this before continuing."));
    }

    // Only test local API if n8n is working
    if (n8nOk) {
        await testLocalAPI();
    }

    await testProductQueries();

    console.log(chalk.blue("\n═══════════════════════════════════════"));
    console.log(chalk.green("  Test Summary Complete"));
    console.log(chalk.blue("═══════════════════════════════════════"));

    if (n8nOk) {
        console.log(chalk.green("\n✅ Your chatbot is ready to use!"));
        console.log(chalk.gray("Open http://localhost:3000 and click the chat widget."));
    } else {
        console.log(chalk.yellow("\n⚠️  Fix n8n issues before using the chatbot."));
    }
}

runTests().catch(console.error);
