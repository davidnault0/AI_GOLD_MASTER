# 📚 Référence Complète Pine Script v6

## 🎯 Guide de Référence Rapide

Ce document contient toutes les règles, syntaxe, et fonctions de Pine Script v6 pour référence constante.

---

## 1. STRUCTURE DE BASE

### Déclaration Obligatoire de Version
```pine
//@version=6
```
⚠️ **Doit être la première ligne du script!**

### Déclaration du Type de Script

#### Indicateur
```pine
indicator(title, shorttitle, overlay, format, precision, scale, max_bars_back)
```

Exemples:
```pine
indicator("Mon Indicateur", overlay=true)
indicator("RSI", overlay=false, precision=2)
```

#### Stratégie
```pine
strategy(title, shorttitle, overlay, format, precision, pyramiding, ...)
```

Exemple:
```pine
strategy("Ma Stratégie", overlay=true, pyramiding=1)
```

⚠️ **NE PAS mélanger indicator() et strategy() dans le même script!**

---

## 2. TYPES DE DONNÉES

### Types Primitifs
- **int** - Nombres entiers (1, 2, 100, -5)
- **float** - Nombres décimaux (1.5, 3.14, -0.5)
- **bool** - Booléens (true, false)
- **string** - Chaînes de caractères ("texte", 'texte')
- **color** - Couleurs (color.red, #FF0000)

### Types Spéciaux
- **series** - Série de valeurs (une par barre)
- **simple** - Valeur simple constante
- **input** - Valeur d'entrée utilisateur

### Déclaration de Variables
```pine
// Type automatique
maVariable = 10
maVariable := 20  // Réassignation

// Type explicite
int monEntier = 10
float monDecimal = 3.14
bool monBooleen = true
string monTexte = "Hello"
color maCouleur = color.red
```

---

## 3. FONCTIONS INPUT (v6)

### input.int()
```pine
input.int(defval, title, minval, maxval, step, tooltip, inline, group)
```

Exemple:
```pine
length = input.int(14, "Période", minval=1, maxval=500)
```

### input.float()
```pine
input.float(defval, title, minval, maxval, step, tooltip, inline, group)
```

Exemple:
```pine
multiplier = input.float(2.0, "Multiplicateur", minval=0.1, step=0.1)
```

### input.bool()
```pine
input.bool(defval, title, tooltip, inline, group)
```

Exemple:
```pine
showSignals = input.bool(true, "Afficher les signaux")
```

### input.string()
```pine
input.string(defval, title, options, tooltip, inline, group)
```

Exemple:
```pine
maType = input.string("SMA", "Type MA", options=["SMA", "EMA", "WMA"])
```

### input.source()
```pine
input.source(defval, title, tooltip, inline, group)
```

Exemple:
```pine
src = input.source(close, "Source")
```

### input.timeframe()
```pine
input.timeframe(defval, title, tooltip, inline, group)
```

### input.color()
```pine
input.color(defval, title, tooltip, inline, group)
```

Exemple:
```pine
lineColor = input.color(color.blue, "Couleur de ligne")
```

⚠️ **v6: Utilisez input.TYPE() au lieu de input() seul**

---

## 4. FONCTIONS TECHNIQUES (ta.*)

### Moyennes Mobiles

#### ta.sma()
```pine
ta.sma(source, length)
```
Exemple: `smaValue = ta.sma(close, 14)`

#### ta.ema()
```pine
ta.ema(source, length)
```
Exemple: `emaValue = ta.ema(close, 21)`

#### ta.wma()
```pine
ta.wma(source, length)
```
Moyenne mobile pondérée

#### ta.vwma()
```pine
ta.vwma(source, length)
```
Moyenne mobile pondérée par volume

#### ta.alma()
```pine
ta.alma(series, length, offset, sigma)
```
Arnaud Legoux Moving Average

### Indicateurs de Momentum

#### ta.rsi()
```pine
ta.rsi(source, length)
```
Exemple: `rsiValue = ta.rsi(close, 14)`

#### ta.macd()
```pine
[macdLine, signalLine, histLine] = ta.macd(source, fast, slow, signal)
```
Exemple:
```pine
[macd, signal, hist] = ta.macd(close, 12, 26, 9)
```

#### ta.stoch()
```pine
ta.stoch(source, high, low, length)
```

#### ta.cci()
```pine
ta.cci(source, length)
```
Commodity Channel Index

#### ta.mfi()
```pine
ta.mfi(series, length)
```
Money Flow Index

### Volatilité

#### ta.atr()
```pine
ta.atr(length)
```
Average True Range
Exemple: `atrValue = ta.atr(14)`

#### ta.bb()
```pine
[middle, upper, lower] = ta.bb(source, length, mult)
```
Bollinger Bands
Exemple:
```pine
[basis, upper, lower] = ta.bb(close, 20, 2.0)
```

#### ta.stdev()
```pine
ta.stdev(source, length)
```
Écart-type

### Volume

#### ta.vwap()
```pine
ta.vwap(source)
```
Volume Weighted Average Price
Exemple: `vwapValue = ta.vwap(close)`

### Croisements

#### ta.crossover()
```pine
ta.crossover(source1, source2)
```
Retourne true si source1 croise au-dessus de source2
Exemple: `bullish = ta.crossover(fastMA, slowMA)`

#### ta.crossunder()
```pine
ta.crossunder(source1, source2)
```
Retourne true si source1 croise en-dessous de source2
Exemple: `bearish = ta.crossunder(fastMA, slowMA)`

#### ta.cross()
```pine
ta.cross(source1, source2)
```
Retourne true si source1 croise source2 (dans n'importe quelle direction)

### Extremums

#### ta.highest()
```pine
ta.highest(source, length)
```
Plus haute valeur sur N barres

#### ta.lowest()
```pine
ta.lowest(source, length)
```
Plus basse valeur sur N barres

#### ta.highestbars()
```pine
ta.highestbars(source, length)
```
Index de la barre avec la plus haute valeur

#### ta.lowestbars()
```pine
ta.lowestbars(source, length)
```
Index de la barre avec la plus basse valeur

### Changement et Différence

#### ta.change()
```pine
ta.change(source, length)
```
Différence entre valeur actuelle et valeur N barres avant

#### ta.mom()
```pine
ta.mom(source, length)
```
Momentum

#### ta.roc()
```pine
ta.roc(source, length)
```
Rate of Change (pourcentage)

### Sommation

#### ta.cum()
```pine
ta.cum(source)
```
Somme cumulative

---

## 5. VARIABLES INTÉGRÉES

### Prix OHLCV
- **open** - Prix d'ouverture
- **high** - Prix le plus haut
- **low** - Prix le plus bas
- **close** - Prix de clôture
- **volume** - Volume
- **hl2** - (high + low) / 2
- **hlc3** - (high + low + close) / 3
- **ohlc4** - (open + high + low + close) / 4
- **hlcc4** - (high + low + close + close) / 4

### Informations de Barre
- **time** - Timestamp de la barre (milliseconds)
- **time_close** - Timestamp de fermeture
- **bar_index** - Index de la barre (0, 1, 2...)
- **barstate.isfirst** - true sur première barre
- **barstate.islast** - true sur dernière barre
- **barstate.isrealtime** - true sur barre en temps réel
- **barstate.isnew** - true sur nouvelle barre
- **barstate.isconfirmed** - true quand barre confirmée
- **barstate.islastconfirmedhistory** - true sur dernière barre historique

### Informations de Symbole
- **syminfo.ticker** - Symbole (ex: "BTCUSD")
- **syminfo.currency** - Devise (ex: "USD")
- **syminfo.basecurrency** - Devise de base (ex: "BTC")
- **syminfo.type** - Type (stock, crypto, forex...)
- **syminfo.timezone** - Fuseau horaire
- **syminfo.session** - Session de trading

### Timeframe
- **timeframe.period** - Période actuelle ("D", "60", "1W")
- **timeframe.isdaily** - true si timeframe daily
- **timeframe.isweekly** - true si timeframe weekly
- **timeframe.ismonthly** - true si timeframe monthly
- **timeframe.isintraday** - true si intraday

---

## 6. FONCTIONS DE PLOT

### plot()
```pine
plot(series, title, color, linewidth, style, trackprice, histbase, offset, join, editable, show_last, display)
```

Exemples:
```pine
plot(close, "Prix", color=color.blue, linewidth=2)
plot(sma, color=color.red, style=plot.style_line)
plot(volume, style=plot.style_histogram)
```

### Styles de plot
- **plot.style_line** - Ligne
- **plot.style_stepline** - Ligne en escalier
- **plot.style_histogram** - Histogramme
- **plot.style_cross** - Croix
- **plot.style_area** - Aire
- **plot.style_columns** - Colonnes
- **plot.style_circles** - Cercles
- **plot.style_linebr** - Ligne avec breaks

### plotshape()
```pine
plotshape(series, title, style, location, color, size, text, textcolor, offset, editable)
```

Exemple:
```pine
plotshape(buySignal, "Achat", shape.triangleup, location.belowbar, color.green, size=size.small)
```

### Shapes disponibles
- **shape.triangleup** - Triangle vers le haut
- **shape.triangledown** - Triangle vers le bas
- **shape.circle** - Cercle
- **shape.cross** - Croix
- **shape.xcross** - X
- **shape.diamond** - Diamant
- **shape.square** - Carré
- **shape.flag** - Drapeau
- **shape.arrowup** - Flèche vers le haut
- **shape.arrowdown** - Flèche vers le bas

### plotchar()
```pine
plotchar(series, title, char, location, color, size, text, textcolor, offset, editable)
```

### plotarrow()
```pine
plotarrow(series, title, colorup, colordown, offset, minheight, maxheight)
```

### plotcandle()
```pine
plotcandle(open, high, low, close, title, color, wickcolor, editable, bordercolor)
```

### hline()
```pine
hline(price, title, color, linestyle, linewidth, editable)
```

Exemple:
```pine
hline(0, "Zéro", color=color.gray, linestyle=hline.style_dashed)
```

### Styles de hline
- **hline.style_solid** - Ligne solide
- **hline.style_dashed** - Ligne pointillée
- **hline.style_dotted** - Ligne à points

### fill()
```pine
fill(plot1, plot2, color, title, editable, fillgaps)
```

Exemple:
```pine
p1 = plot(upper)
p2 = plot(lower)
fill(p1, p2, color=color.new(color.blue, 90))
```

### bgcolor()
```pine
bgcolor(color, offset, editable, title)
```

Exemple:
```pine
bgcolor(overbought ? color.new(color.red, 90) : na)
```

---

## 7. COULEURS

### Couleurs Prédéfinies
- **color.red** - Rouge
- **color.green** - Vert
- **color.blue** - Bleu
- **color.yellow** - Jaune
- **color.orange** - Orange
- **color.purple** - Violet
- **color.white** - Blanc
- **color.black** - Noir
- **color.gray** - Gris
- **color.silver** - Argent
- **color.maroon** - Marron
- **color.lime** - Vert citron
- **color.navy** - Bleu marine
- **color.teal** - Turquoise
- **color.aqua** - Aqua
- **color.fuchsia** - Fuchsia

### color.new()
```pine
color.new(baseColor, transparency)
```
Transparency: 0 (opaque) à 100 (transparent)

Exemple:
```pine
transparentRed = color.new(color.red, 70)
```

### color.rgb()
```pine
color.rgb(red, green, blue, transp)
```
RGB values: 0-255
Transparency: 0-100

Exemple:
```pine
myColor = color.rgb(255, 128, 0, 50)
```

---

## 8. OPÉRATEURS

### Opérateurs Arithmétiques
- **+** - Addition
- **-** - Soustraction
- **\*** - Multiplication
- **/** - Division
- **%** - Modulo

### Opérateurs de Comparaison
- **==** - Égal à
- **!=** - Différent de
- **>** - Supérieur à
- **<** - Inférieur à
- **>=** - Supérieur ou égal
- **<=** - Inférieur ou égal

### Opérateurs Logiques
- **and** - ET logique
- **or** - OU logique
- **not** - NON logique

### Opérateur Ternaire
```pine
condition ? valueIfTrue : valueIfFalse
```

Exemple:
```pine
color = close > open ? color.green : color.red
```

---

## 9. STRUCTURES DE CONTRÔLE

### if/else
```pine
if condition
    // code si vrai
else if autreCondition
    // code si autre condition vraie
else
    // code sinon
```

Exemple:
```pine
if close > open
    color = color.green
else
    color = color.red
```

### Expression if ternaire
```pine
result = if condition
    valueIfTrue
else
    valueIfFalse
```

### for
```pine
for i = 0 to length - 1
    // code
```

Exemple:
```pine
sum = 0.0
for i = 0 to 9
    sum := sum + close[i]
average = sum / 10
```

### while
```pine
while condition
    // code
```

---

## 10. FONCTIONS STRATEGY (Stratégies)

### strategy.entry()
```pine
strategy.entry(id, direction, qty, limit, stop, oca_name, oca_type, comment, when, alert_message)
```

Exemple:
```pine
if longCondition
    strategy.entry("Long", strategy.long)
```

### strategy.close()
```pine
strategy.close(id, when, comment, qty, qty_percent, alert_message)
```

Exemple:
```pine
if exitCondition
    strategy.close("Long")
```

### strategy.exit()
```pine
strategy.exit(id, from_entry, qty, qty_percent, profit, limit, loss, stop, trail_price, trail_points, trail_offset, oca_name, comment, when, alert_message)
```

Exemple:
```pine
strategy.exit("Exit", "Long", profit=100, loss=50)
```

### Directions
- **strategy.long** - Position longue (achat)
- **strategy.short** - Position courte (vente)

---

## 11. FONCTIONS request.*

### request.security()
```pine
request.security(symbol, timeframe, expression, gaps, lookahead, ignore_invalid_symbol, currency)
```

⚠️ **v6: Utilisez request.security() au lieu de security()**

Exemple:
```pine
dailyClose = request.security(syminfo.tickerid, "D", close)
```

---

## 12. FONCTIONS MATH

### Fonctions de Base
- **math.abs(x)** - Valeur absolue
- **math.ceil(x)** - Arrondir vers le haut
- **math.floor(x)** - Arrondir vers le bas
- **math.round(x)** - Arrondir au plus proche
- **math.max(x, y)** - Maximum
- **math.min(x, y)** - Minimum
- **math.pow(x, y)** - x puissance y
- **math.sqrt(x)** - Racine carrée
- **math.exp(x)** - Exponentielle
- **math.log(x)** - Logarithme naturel
- **math.log10(x)** - Logarithme base 10

### Fonctions Trigonométriques
- **math.sin(x)** - Sinus
- **math.cos(x)** - Cosinus
- **math.tan(x)** - Tangente
- **math.asin(x)** - Arc sinus
- **math.acos(x)** - Arc cosinus
- **math.atan(x)** - Arc tangente

### Constantes
- **math.pi** - Pi (3.14159...)
- **math.e** - e (2.71828...)

---

## 13. FONCTIONS STRING

- **str.tostring(value)** - Convertir en string
- **str.tonumber(string)** - Convertir en nombre
- **str.length(string)** - Longueur
- **str.upper(string)** - Majuscules
- **str.lower(string)** - Minuscules
- **str.substring(string, begin, end)** - Sous-chaîne
- **str.contains(source, str)** - Contient
- **str.pos(source, str)** - Position
- **str.replace(source, target, replacement)** - Remplacer

---

## 14. FONCTIONS ARRAY (Tableaux)

### Création
```pine
myArray = array.new_float(size, initial_value)
myArray = array.new_int(size, initial_value)
myArray = array.new_bool(size, initial_value)
myArray = array.new_string(size, initial_value)
myArray = array.new_color(size, initial_value)
```

### Manipulation
- **array.size(id)** - Taille
- **array.get(id, index)** - Obtenir élément
- **array.set(id, index, value)** - Définir élément
- **array.push(id, value)** - Ajouter à la fin
- **array.pop(id)** - Retirer de la fin
- **array.unshift(id, value)** - Ajouter au début
- **array.shift(id)** - Retirer du début
- **array.clear(id)** - Vider
- **array.sort(id, order)** - Trier
- **array.reverse(id)** - Inverser
- **array.slice(id, index_from, index_to)** - Extraire portion
- **array.sum(id)** - Somme
- **array.avg(id)** - Moyenne
- **array.min(id)** - Minimum
- **array.max(id)** - Maximum

---

## 15. RÈGLES IMPORTANTES

### ⚠️ À NE PAS FAIRE

1. **Ne pas mélanger indicator() et strategy()**
```pine
// ❌ INCORRECT
indicator("Test")
strategy.entry("Long", strategy.long)

// ✅ CORRECT - Choisir l'un ou l'autre
strategy("Test")
strategy.entry("Long", strategy.long)
```

2. **Ne pas utiliser security() - Utiliser request.security()**
```pine
// ❌ INCORRECT (v5 et avant)
value = security(syminfo.tickerid, "D", close)

// ✅ CORRECT (v6)
value = request.security(syminfo.tickerid, "D", close)
```

3. **Ne pas utiliser study() - Utiliser indicator()**
```pine
// ❌ INCORRECT (v5 et avant)
study("Mon Indicateur")

// ✅ CORRECT (v6)
indicator("Mon Indicateur")
```

4. **Ne pas utiliser input() seul - Spécifier le type**
```pine
// ❌ INCORRECT
length = input(14, "Période")

// ✅ CORRECT (v6)
length = input.int(14, "Période")
```

5. **Toujours fermer parenthèses, crochets, accolades**
```pine
// ❌ INCORRECT
plot(ta.sma(close, 14)

// ✅ CORRECT
plot(ta.sma(close, 14))
```

### ✅ BONNES PRATIQUES

1. **Commenter votre code**
```pine
// Calcul de la moyenne mobile
smaValue = ta.sma(close, 14)
```

2. **Nommer variables clairement**
```pine
// ✅ BON
fastEMA = ta.ema(close, 12)
slowEMA = ta.ema(close, 26)

// ❌ MAUVAIS
a = ta.ema(close, 12)
b = ta.ema(close, 26)
```

3. **Grouper les inputs**
```pine
lengthInput = input.int(14, "Période", group="Paramètres")
sourceInput = input.source(close, "Source", group="Paramètres")
```

4. **Utiliser des couleurs avec transparence**
```pine
bgcolor(condition ? color.new(color.red, 90) : na)
```

5. **Valider les conditions avant plot**
```pine
if not na(smaValue)
    plot(smaValue, "SMA")
```

---

## 16. ERREURS COURANTES ET SOLUTIONS

### Erreur: "Undeclared identifier"
**Cause**: Variable non déclarée ou mal orthographiée
**Solution**: Vérifier l'orthographe et déclarer la variable

### Erreur: "Mismatched input"
**Cause**: Syntaxe incorrecte, parenthèse manquante
**Solution**: Vérifier parenthèses, virgules, syntaxe

### Erreur: "Cannot call 'indicator' after 'strategy'"
**Cause**: Mélange indicator() et strategy()
**Solution**: Utiliser seulement l'un ou l'autre

### Erreur: "'study' is deprecated"
**Cause**: Utilisation de syntaxe v5
**Solution**: Remplacer study() par indicator()

### Erreur: "'security' is deprecated"
**Cause**: Utilisation de syntaxe v5
**Solution**: Remplacer security() par request.security()

---

## 17. TEMPLATE DE BASE

### Template Indicateur
```pine
//@version=6
indicator("Nom de l'Indicateur", overlay=true)

// === INPUTS ===
lengthInput = input.int(14, "Période", minval=1)
sourceInput = input.source(close, "Source")

// === CALCULS ===
value = ta.sma(sourceInput, lengthInput)

// === PLOTS ===
plot(value, "Valeur", color=color.blue, linewidth=2)
```

### Template Stratégie
```pine
//@version=6
strategy("Nom de la Stratégie", overlay=true)

// === INPUTS ===
lengthInput = input.int(14, "Période", minval=1)

// === CALCULS ===
fastMA = ta.ema(close, 9)
slowMA = ta.ema(close, 21)

// === LOGIQUE ===
longCondition = ta.crossover(fastMA, slowMA)
shortCondition = ta.crossunder(fastMA, slowMA)

// === TRADES ===
if longCondition
    strategy.entry("Long", strategy.long)

if shortCondition
    strategy.close("Long")

// === PLOTS ===
plot(fastMA, "Fast MA", color=color.blue)
plot(slowMA, "Slow MA", color=color.red)
```

---

## 📌 RÉSUMÉ DES CHANGEMENTS v5 → v6

| v5 (Ancien) | v6 (Nouveau) |
|-------------|--------------|
| `study()` | `indicator()` |
| `security()` | `request.security()` |
| `input()` | `input.int()`, `input.float()`, etc. |

---

**📚 Ce document est votre référence complète pour Pine Script v6!**

Gardez-le à portée de main pour toujours avoir les bonnes pratiques et syntaxe correcte.
