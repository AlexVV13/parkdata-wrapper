## Members

<dl>
<dt><a href="#destination">destination</a></dt>
<dd><p>Een resort of bestemming, bv. &quot;Universal Orlando&quot;</p>
</dd>
<dt><a href="#park">park</a></dt>
<dd><p>Een enkel park binnen een bestemming, bv. &quot;Islands of Adventure&quot;</p>
</dd>
<dt><a href="#attraction">attraction</a></dt>
<dd><p>Attractie / rit binnen een park</p>
</dd>
<dt><a href="#restaurant">restaurant</a></dt>
<dd><p>Restaurant binnen een park</p>
</dd>
<dt><a href="#show">show</a></dt>
<dd><p>Show of voorstelling binnen een park</p>
</dd>
<dt><a href="#STANDBY">STANDBY</a></dt>
<dd><p>Standaard wachtrij</p>
</dd>
<dt><a href="#SINGLE_RIDER">SINGLE_RIDER</a></dt>
<dd><p>Single Rider rij</p>
</dd>
<dt><a href="#FASTPASS">FASTPASS</a></dt>
<dd><p>FastPass / express pass rij</p>
</dd>
<dt><a href="#VIRTUAL">VIRTUAL</a></dt>
<dd><p>Virtuele wachtrij</p>
</dd>
<dt><a href="#THRILL">THRILL</a></dt>
<dd><p>Thrill attractie / spannend / achtbaan</p>
</dd>
<dt><a href="#FAMILY">FAMILY</a></dt>
<dd><p>Familie-attractie / geschikt voor alle leeftijden</p>
</dd>
<dt><a href="#INDOOR">INDOOR</a></dt>
<dd><p>Binnenactiviteit</p>
</dd>
<dt><a href="#OUTDOOR">OUTDOOR</a></dt>
<dd><p>Buitenactiviteit</p>
</dd>
<dt><a href="#WATER">WATER</a></dt>
<dd><p>Watergerelateerde attractie</p>
</dd>
<dt><a href="#KIDS">KIDS</a></dt>
<dd><p>Kindvriendelijk / geschikt voor jonge kinderen</p>
</dd>
</dl>

## Constants

<dl>
<dt><a href="#cache">cache</a> : <code>Map.&lt;string, {value: any, timestamp: number}&gt;</code></dt>
<dd><p>Eenvoudige in-memory cache.</p>
</dd>
<dt><a href="#destinations">destinations</a> : <code>Object.&lt;string, Object&gt;</code></dt>
<dd><p>Alle ondersteunde bestemmingen / resorts.
Resorts bevatten meerdere parken, losse parken bevatten enkel zichzelf.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#fetchRaw">fetchRaw(endpoint)</a> ⇒ <code>Promise.&lt;any&gt;</code></dt>
<dd><p>Voer een raw fetch uit naar de API.</p>
</dd>
<dt><a href="#cachedFetch">cachedFetch(key, ttl, fn)</a> ⇒ <code>Promise.&lt;any&gt;</code></dt>
<dd><p>Cached fetch wrapper.</p>
</dd>
<dt><a href="#getAttractions">getAttractions()</a> ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code></dt>
<dd><p>Haal attracties op van het park.</p>
</dd>
<dt><a href="#getShows">getShows()</a> ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code></dt>
<dd><p>Haal shows op van het park.</p>
</dd>
<dt><a href="#getRestaurants">getRestaurants()</a> ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code></dt>
<dd><p>Haal restaurants op van het park.</p>
</dd>
<dt><a href="#getOpeningTimes">getOpeningTimes()</a> ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code></dt>
<dd><p>Haal openingstijden op van het park.</p>
</dd>
<dt><a href="#normalizeQueue">normalizeQueue(options)</a> ⇒ <code>Object</code></dt>
<dd><p>Normaliseer wachtrij data.</p>
</dd>
<dt><a href="#normalizeEntity">normalizeEntity(options)</a> ⇒ <code>Object</code></dt>
<dd><p>Normaliseer entity data (attractie, show, restaurant).</p>
</dd>
<dt><a href="#normalizeSchedule">normalizeSchedule(options)</a> ⇒ <code>Object</code></dt>
<dd><p>Bouw een standaard openingstijd object.</p>
</dd>
<dt><a href="#getMetadata">getMetadata()</a> ⇒ <code>Object</code></dt>
<dd><p>Haal metadata op over dit park.</p>
</dd>
<dt><a href="#cached">cached(key, ttlMs, fetchFn)</a> ⇒ <code>Promise.&lt;any&gt;</code></dt>
<dd><p>Cached wrapper voor async fetch functies.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#FetchFn">FetchFn</a> ⇒ <code>Promise.&lt;any&gt;</code></dt>
<dd><p>Callback type voor een async fetch functie.</p>
</dd>
<dt><a href="#FetchFn">FetchFn</a> ⇒ <code>Promise.&lt;any&gt;</code></dt>
<dd><p>Callback type voor een async fetch functie.</p>
</dd>
</dl>

<a name="destination"></a>

## destination
Een resort of bestemming, bv. "Universal Orlando"

**Kind**: global variable  
<a name="park"></a>

## park
Een enkel park binnen een bestemming, bv. "Islands of Adventure"

**Kind**: global variable  
<a name="attraction"></a>

## attraction
Attractie / rit binnen een park

**Kind**: global variable  
<a name="restaurant"></a>

## restaurant
Restaurant binnen een park

**Kind**: global variable  
<a name="show"></a>

## show
Show of voorstelling binnen een park

**Kind**: global variable  
<a name="STANDBY"></a>

## STANDBY
Standaard wachtrij

**Kind**: global variable  
<a name="SINGLE_RIDER"></a>

## SINGLE\_RIDER
Single Rider rij

**Kind**: global variable  
<a name="FASTPASS"></a>

## FASTPASS
FastPass / express pass rij

**Kind**: global variable  
<a name="VIRTUAL"></a>

## VIRTUAL
Virtuele wachtrij

**Kind**: global variable  
<a name="THRILL"></a>

## THRILL
Thrill attractie / spannend / achtbaan

**Kind**: global variable  
<a name="FAMILY"></a>

## FAMILY
Familie-attractie / geschikt voor alle leeftijden

**Kind**: global variable  
<a name="INDOOR"></a>

## INDOOR
Binnenactiviteit

**Kind**: global variable  
<a name="OUTDOOR"></a>

## OUTDOOR
Buitenactiviteit

**Kind**: global variable  
<a name="WATER"></a>

## WATER
Watergerelateerde attractie

**Kind**: global variable  
<a name="KIDS"></a>

## KIDS
Kindvriendelijk / geschikt voor jonge kinderen

**Kind**: global variable  
<a name="entityType"></a>

## entityType : <code>enum</code>
Beschikbare entity types voor parkdata.

**Kind**: global enum  
<a name="QUEUE_TYPES"></a>

## QUEUE\_TYPES : <code>enum</code>
Beschikbare wachtrij types voor attracties.

**Kind**: global enum  
<a name="TAGS"></a>

## TAGS : <code>enum</code>
Beschikbare tags voor attracties, shows en restaurants.
Helpt bij categoriseren en filteren van entiteiten.

**Kind**: global enum  
<a name="cache"></a>

## cache : <code>Map.&lt;string, {value: any, timestamp: number}&gt;</code>
Eenvoudige in-memory cache.

**Kind**: global constant  
<a name="destinations"></a>

## destinations : <code>Object.&lt;string, Object&gt;</code>
Alle ondersteunde bestemmingen / resorts.
Resorts bevatten meerdere parken, losse parken bevatten enkel zichzelf.

**Kind**: global constant  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| parcAsterix | <code>Object</code> | Parc Asterix park instance |

**Example**  
```js
import destinations from './src/index.js';
const parc = destinations.parcAsterix;
const attractions = await parc.getAttractions();
```
<a name="fetchRaw"></a>

## fetchRaw(endpoint) ⇒ <code>Promise.&lt;any&gt;</code>
Voer een raw fetch uit naar de API.

**Kind**: global function  
**Returns**: <code>Promise.&lt;any&gt;</code> - JSON response  

| Param | Type | Description |
| --- | --- | --- |
| endpoint | <code>string</code> | Endpoint achter baseUrl |

<a name="cachedFetch"></a>

## cachedFetch(key, ttl, fn) ⇒ <code>Promise.&lt;any&gt;</code>
Cached fetch wrapper.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | Cache key |
| ttl | <code>number</code> | Tijd in seconden |
| fn | [<code>FetchFn</code>](#FetchFn) | Async fetch functie |

<a name="getAttractions"></a>

## *getAttractions() ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code>*
Haal attracties op van het park.

**Kind**: global abstract function  
<a name="getShows"></a>

## *getShows() ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code>*
Haal shows op van het park.

**Kind**: global abstract function  
<a name="getRestaurants"></a>

## *getRestaurants() ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code>*
Haal restaurants op van het park.

**Kind**: global abstract function  
<a name="getOpeningTimes"></a>

## *getOpeningTimes() ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code>*
Haal openingstijden op van het park.

**Kind**: global abstract function  
<a name="normalizeQueue"></a>

## normalizeQueue(options) ⇒ <code>Object</code>
Normaliseer wachtrij data.

**Kind**: global function  
**Returns**: <code>Object</code> - Genormaliseerd wachtrij object  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  |  |
| [options.waitTime] | <code>number</code> \| <code>null</code> | <code></code> | Wachttijd in minuten |
| [options.status] | <code>string</code> | <code>&quot;\&quot;Closed\&quot;&quot;</code> | Status van de wachtrij |
| [options.type] | <code>string</code> | <code>&quot;QUEUE_TYPES.STANDBY&quot;</code> | Type wachtrij |

<a name="normalizeEntity"></a>

## normalizeEntity(options) ⇒ <code>Object</code>
Normaliseer entity data (attractie, show, restaurant).

**Kind**: global function  
**Returns**: <code>Object</code> - Genormaliseerd entity object  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  |  |
| options.id | <code>string</code> |  | Unieke ID binnen het park |
| options.name | <code>string</code> |  | Naam van de entity |
| options.entityType | <code>string</code> |  | Type entity ("ride", "show", "restaurant") |
| [options.tags] | <code>Array.&lt;string&gt;</code> | <code>[]</code> | Tags |
| [options.location] | <code>Object</code> | <code>{}</code> | Locatie { lat, lng } |
| [options.waitTime] | <code>number</code> \| <code>null</code> | <code></code> | Wachttijd |
| [options.status] | <code>string</code> | <code>&quot;\&quot;Closed\&quot;&quot;</code> | Status |
| [options.queues] | <code>Array.&lt;Object&gt;</code> | <code>[]</code> | Queue data |

<a name="normalizeSchedule"></a>

## normalizeSchedule(options) ⇒ <code>Object</code>
Bouw een standaard openingstijd object.

**Kind**: global function  
**Returns**: <code>Object</code> - Genormaliseerd openingstijd object  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  |  |
| options.date | <code>string</code> |  | Datum in 'YYYY-MM-DD' |
| [options.openingTime] | <code>string</code> \| <code>null</code> | <code>null</code> | Openingstijd ISO |
| [options.closingTime] | <code>string</code> \| <code>null</code> | <code>null</code> | Sluitingstijd ISO |
| [options.type] | <code>string</code> | <code>&quot;\&quot;OPERATING\&quot;&quot;</code> | Type dag |

<a name="getMetadata"></a>

## getMetadata() ⇒ <code>Object</code>
Haal metadata op over dit park.

**Kind**: global function  
**Returns**: <code>Object</code> - Metadata object  
<a name="cached"></a>

## cached(key, ttlMs, fetchFn) ⇒ <code>Promise.&lt;any&gt;</code>
Cached wrapper voor async fetch functies.

**Kind**: global function  
**Returns**: <code>Promise.&lt;any&gt;</code> - - Cached of nieuwe data  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | Unieke cache key |
| ttlMs | <code>number</code> | Time-to-live in milliseconden |
| fetchFn | [<code>FetchFn</code>](#FetchFn) | Async functie die data ophaalt |

<a name="FetchFn"></a>

## FetchFn ⇒ <code>Promise.&lt;any&gt;</code>
Callback type voor een async fetch functie.

**Kind**: global typedef  
<a name="FetchFn"></a>

## FetchFn ⇒ <code>Promise.&lt;any&gt;</code>
Callback type voor een async fetch functie.

**Kind**: global typedef  
