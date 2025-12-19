import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { supabase } from './supabaseClient.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ===== HEALTH CHECK =====
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running! 🎣' });
});

// ===== GET ALL PATTERNS =====
app.get('/api/patterns', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('patterns')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== GET PATTERN BY ID =====
app.get('/api/patterns/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('patterns')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== CREATE PATTERN (needs auth) =====
app.post('/api/patterns', async (req, res) => {
  try {
    const { title, description, difficulty, yarn_weight, hook_size, estimated_time, image_url, pattern_content, user_id } = req.body;

    const { data, error } = await supabase
      .from('patterns')
      .insert([
        {
          title,
          description,
          difficulty,
          yarn_weight,
          hook_size,
          estimated_time,
          image_url,
          pattern_content,
          user_id,
        },
      ])
      .select();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== DELETE PATTERN =====
app.delete('/api/patterns/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('patterns')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ message: 'Pattern deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`🎣 Hooksy server running on http://localhost:${PORT}`);
});
