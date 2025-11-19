const express = require("express");
const cors = require("cors");
const path = require("path");
const { execSync } = require("child_process");

const app = express();
app.use(cors());
app.use(express.json());

const MOD_EXP_PATH = path.join(__dirname, "modexp_server.exe");

app.post("/dh", (req, res) => {
    try {
        const { g, p, x } = req.body;

        // Always treat as strings
        const g_str = g.toString();
        const p_str = p.toString();
        const x_str = x.toString();

        // Convert to number ONLY for generating b
        let p_num = Number(p_str);

        // Always allow p (no restrictions)
        // If p is invalid or small, fallback to b = 1
        let b = 1;
        if (Number.isFinite(p_num) && p_num > 2) {
            b = Math.floor(Math.random() * (p_num - 2)) + 1;
        }

        const cmd = `"${MOD_EXP_PATH}" ${g_str} ${p_str} ${x_str} ${b}`;
        const output = execSync(cmd).toString().trim();

        if (!output) {
            return res.status(500).json({ error: "modexp_server produced no output" });
        }

        const [K, y] = output.split(/\s+/);

        return res.json({ K, y });

    } catch (err) {
        console.error("C PROGRAM ERROR:", err);
        if (err.stdout) console.error("STDOUT:", err.stdout.toString());
        if (err.stderr) console.error("STDERR:", err.stderr.toString());
        return res.status(500).json({ error: "Internal server error running C program" });
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
