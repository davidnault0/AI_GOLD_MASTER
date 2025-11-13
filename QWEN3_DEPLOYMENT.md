# Guide de Déploiement Qwen 3 (Gwen 3)

Ce guide explique comment déployer Qwen 3 localement pour une efficacité réseau maximale.

## Prérequis Matériels

### Configuration Minimale
- **GPU**: NVIDIA RTX 3090 ou supérieur
- **VRAM**: 24 GB minimum
- **RAM**: 32 GB système
- **Stockage**: 100 GB SSD libre

### Configuration Recommandée
- **GPU**: NVIDIA A100 ou RTX 4090
- **VRAM**: 48 GB ou plus
- **RAM**: 64 GB système
- **Stockage**: 200 GB SSD NVMe

## Installation

### Option 1: Utilisation de vLLM (Recommandé)

```bash
# Installer vLLM
pip install vllm

# Télécharger le modèle Qwen 3
# Le modèle sera téléchargé automatiquement depuis HuggingFace

# Lancer le serveur
python -m vllm.entrypoints.openai.api_server \
    --model Qwen/Qwen2.5-7B-Instruct \
    --port 8000 \
    --gpu-memory-utilization 0.9
```

### Option 2: Utilisation de Ollama (Simple)

```bash
# Installer Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Télécharger et lancer Qwen 3
ollama pull qwen2.5:7b
ollama run qwen2.5:7b

# Pour exposer l'API
ollama serve
```

### Option 3: Utilisation de Text Generation WebUI

```bash
# Cloner le dépôt
git clone https://github.com/oobabooga/text-generation-webui
cd text-generation-webui

# Installer les dépendances
pip install -r requirements.txt

# Lancer l'interface
python server.py --model Qwen/Qwen2.5-7B-Instruct --api
```

## Configuration du Réseau

### Endpoint Local
Par défaut, Qwen 3 sera accessible à : `http://localhost:8000`

### Configuration pour Accès Réseau

Si vous voulez accéder depuis d'autres machines :

```bash
# Lancer avec binding sur toutes les interfaces
python -m vllm.entrypoints.openai.api_server \
    --model Qwen/Qwen2.5-7B-Instruct \
    --host 0.0.0.0 \
    --port 8000
```

⚠️ **Sécurité**: Assurez-vous de configurer un pare-feu et une authentification appropriés.

## Test de l'Installation

### Test via curl

```bash
curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qwen-3",
    "messages": [
      {"role": "user", "content": "Write a simple Pine Script indicator"}
    ],
    "temperature": 0.7
  }'
```

### Test avec Node.js

```javascript
const AIModelManager = require('./ai-integration');

const manager = new AIModelManager('qwen-3');
const result = await manager.generatePineScript('Create a RSI indicator');
console.log(result);
```

## Optimisation des Performances

### Ajustement de la Quantification

Pour réduire l'utilisation de VRAM :

```bash
# Utiliser la quantification 4-bit
python -m vllm.entrypoints.openai.api_server \
    --model Qwen/Qwen2.5-7B-Instruct \
    --quantization awq \
    --gpu-memory-utilization 0.9
```

### Ajustement du Batch Size

```bash
# Augmenter le débit pour les traitements par lots
python -m vllm.entrypoints.openai.api_server \
    --model Qwen/Qwen2.5-7B-Instruct \
    --max-num-batched-tokens 4096 \
    --max-num-seqs 256
```

## Comparaison des Variantes Qwen 3

| Modèle | Paramètres | VRAM Requis | Performance | Recommandation |
|--------|------------|-------------|-------------|----------------|
| Qwen2.5-0.5B | 0.5B | 2 GB | Basique | Tests rapides |
| Qwen2.5-3B | 3B | 8 GB | Bonne | Usage général |
| Qwen2.5-7B | 7B | 16 GB | Très bonne | **Recommandé** |
| Qwen2.5-14B | 14B | 28 GB | Excellente | Haute qualité |
| Qwen2.5-32B | 32B | 64 GB | Optimale | Production |
| Qwen2.5-72B | 72B | 144 GB | Meilleure | Serveurs dédiés |

## Monitoring et Maintenance

### Vérification de l'Utilisation GPU

```bash
# Surveiller l'utilisation GPU
watch -n 1 nvidia-smi
```

### Logs et Debugging

```bash
# Activer les logs détaillés
export VLLM_LOGGING_LEVEL=DEBUG

python -m vllm.entrypoints.openai.api_server \
    --model Qwen/Qwen2.5-7B-Instruct
```

### Redémarrage Automatique

Créer un service systemd :

```ini
# /etc/systemd/system/qwen3.service
[Unit]
Description=Qwen 3 AI Model Server
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/your/project
ExecStart=/usr/bin/python -m vllm.entrypoints.openai.api_server --model Qwen/Qwen2.5-7B-Instruct --port 8000
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Activer le service :

```bash
sudo systemctl enable qwen3
sudo systemctl start qwen3
sudo systemctl status qwen3
```

## Dépannage

### Problème: Out of Memory

**Solution**: Utiliser un modèle plus petit ou activer la quantification

```bash
# Utiliser Qwen2.5-3B au lieu de 7B
python -m vllm.entrypoints.openai.api_server \
    --model Qwen/Qwen2.5-3B-Instruct
```

### Problème: Latence Élevée

**Solution**: 
1. Vérifier l'utilisation GPU
2. Réduire le contexte
3. Augmenter `gpu-memory-utilization`

### Problème: Erreur de Connexion

**Solution**: Vérifier que le service est en cours d'exécution

```bash
netstat -tlnp | grep 8000
curl http://localhost:8000/v1/models
```

## Avantages de Qwen 3 Local vs GPT-4o Cloud

| Critère | Qwen 3 Local | GPT-4o Cloud |
|---------|--------------|--------------|
| **Latence** | 50-200ms | 500-2000ms |
| **Coût (1M tokens)** | ~$0 (après setup) | ~$10-15 |
| **Confidentialité** | ✅ Total | ⚠️ Données cloud |
| **Disponibilité** | ✅ 100% local | ⚠️ Dépend d'internet |
| **Qualité** | Très bonne | Excellente |
| **Maintenance** | ⚠️ À votre charge | ✅ Géré par OpenAI |

## Conclusion

Qwen 3 local est idéal pour :
- ✅ Confidentialité des données
- ✅ Faible latence
- ✅ Coûts prévisibles
- ✅ Indépendance d'internet

Considérer GPT-4o si :
- ❌ Pas d'infrastructure GPU
- ❌ Volume faible d'utilisation
- ❌ Besoin de qualité maximale absolue

Pour plus d'informations, consultez [AI_MODEL_COMPARISON.md](./AI_MODEL_COMPARISON.md).
