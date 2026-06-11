export interface Fiaba {
  id: string;
  title: string;
  category: string;
  duration: string;
  description: string;
  text: string;
  illustrationType: 'star' | 'cloud' | 'flower' | 'owl' | 'dolphin' | 'forest';
  coverImage?: string;
  slideImage?: string;
  accentColor?: string;       // colore dominante della slide (hex/hsl)
  accentColorLight?: string;  // versione chiarissima per lo sfondo pagina
  inlineImages?: {
    afterParagraph: number;
    src: string;
    alt: string;
  }[];
}

export const FIABE_PREDEFINITE: Fiaba[] = [
  {
    id: 'stellina-buio',
    title: 'La Stellina che aveva paura del Buio',
    category: 'Stelle & Sogni',
    duration: '4 min',
    description: 'La tenera avventura di Celeste, una piccola stella timida che scopre la bellezza della notte.',
    illustrationType: 'star',
    coverImage: '/stella/stella copertina.png',
    slideImage: '/stella/stellaslide2.png',
    accentColor: '#7c6fcd',        // viola/indaco dalle stelle della slide
    accentColorLight: '#f5f3ff',   // lavanda chiarissima
    inlineImages: [
      { afterParagraph: 0, src: '/stella/stella 1.png', alt: 'Celeste guarda timida dal cielo' },
      { afterParagraph: 4, src: '/stella/stella 2.png', alt: 'Celeste brilla e porta la sua scia luminosa' },
      { afterParagraph: 8, src: '/stella/stella 3.png', alt: 'Celeste splende felice cullando i sogni' }
    ],
    text: `C'era una volta, nel cielo vellutato della sera, una stella piccolissima di nome Celeste. Celeste brillava con una luce azzurra e delicata, ma aveva un segreto molto strano per una stellina: aveva paura del buio.

Ogni volta che il sole scendeva dietro le montagne e la notte stendeva il suo mantello scuro sul mondo, Celeste tremava e cercava di nascondersi dietro le soffici nuvole di passaggio. 'Il buio è troppo grande, troppo vuoto,' sussurrava spaventata.

Una sera, la Luna Argentata, che osservava tutto con saggezza e dolcezza, si accorse del tremolio di Celeste. Con voce calda e rassicurante come una ninna nanna, la chiamò: 'Vieni qui, piccola Celeste. Perché tremi?'

'Oh, regina della notte,' rispose Celeste con un fil di voce, 'ho paura dell'oscurità. È così immensa!'

La Luna sorrise teneramente. 'Guarda giù, Celeste. Vedi quella piccola casa in fondo alla valle? C'è un bambino che non riesce a dormire perché ha paura del buio, proprio come te. E vedi la cameretta? È scura. Ma guarda cosa succede quando tu ti fai coraggio e risplendi.'

Celeste sporse il nasino fuori dalla nuvola e brillò con tutta la forza che aveva nel suo piccolo cuore di luce. Una scia azzurrina attraversò il cielo ed entrò dritta dalla finestra del bambino. 

Il piccolo alzò gli occhi al cielo, vide Celeste, sorrise e si raggomitolò sereno sotto le coperte. 'La mia stellina è sveglia,' pensò il bimbo, 'ora posso fare sogni d'oro.'

La Luna disse allora a Celeste: 'Vedi? Il buio non è vuoto. È solo una tela scura su cui noi disegniamo la luce. Senza l'oscurità, nessuno potrebbe vedere la tua bellissima luce, e quel bambino si sentirebbe solo. Il buio è un amico che ci permette di riposare e di splendere.'

Da quella notte, Celeste non ebbe più paura. Sapeva che il suo compito era accendere un piccolo sogno nell'oscurità, e ogni sera brillava felice, cullando il sonno di tutti i bambini del mondo.`
  },
  {
    id: 'nuvola-pigra',
    title: 'Il Soffio della Nuvola Pigra',
    category: 'Natura & Vento',
    duration: '3 min',
    description: 'Nuvola Nuvolina adora poltrire nel cielo azzurro, finché non scopre il potere di un soffio fresco.',
    illustrationType: 'cloud',
    accentColor: '#5ba4cf',        // azzurro cielo
    accentColorLight: '#f0f7ff',   // azzurro chiarissimo
    text: `Nuvolina era la nuvola più soffice e pigra di tutto il cielo. Mentre le sue sorelle correvano felici spinte dal vento frizzante, portando pioggerellina fresca ai fiori o disegnando forme buffe per far ridere i bambini, Nuvolina preferiva reclinare la testa sulla cima di una montagna alta e fare lunghi sonnellini.

'Nuvolina, vieni a giocare!' la chiamavano le altre nuvole. Ma lei si limitava a sbadigliare, allungandosi pigramente come un gatto di ovatta.

Un pomeriggio d'estate, la terra sotto di lei divenne molto calda. I fiori nei prati chinavano le testoline, stanchi per il sole forte, e gli alberi cercavano un po' d'ombra che non c'era. Perfino i piccoli uccellini nel bosco avevano smesso di cantare e riposavano silenziosi tra i rami.

Nuvolina guardò giù e provò una grande tenerezza per quelle creature così accaldate. 'Caspita,' pensò, 'hanno davvero bisogno di un po' di fresco.'

Decise allora di fare qualcosa che non aveva mai fatto prima: si alzò in piedi nel cielo, inspirò profondamente e gonfiò il suo pancino soffice di aria fresca di montagna. Poi, con un movimento lento e aggraziato, fece un grandissimo soffio verso il basso.

Fffuuuuuuu...

Un vento fresco, profumato di pino e di camomilla selvatica, accarezzò la valle. Le foglie degli alberi iniziarono a danzare felici, i fiori rialzarono le corolle e gli uccellini ripresero a intonare una dolce melodia di ringraziamento.

Nuvolina provò una gioia così grande nel suo cuore di vapore che decise che non sarebbe più stata solo pigra. Ora sapeva che il suo soffio rinfrescante poteva portare sollievo e sogni sereni a chi ne aveva più bisogno. 

E ancora oggi, quando sentite una brezza fresca accarezzarvi il viso nelle calde sere d'estate, sappiate che è solo Nuvolina che vi manda il suo soffio della buonanotte.`
  },
  {
    id: 'giardino-cantante',
    title: 'Il Giardino dei Fiori Cantanti',
    category: 'Magia & Fiabe',
    duration: '5 min',
    description: 'Nel cuore della foresta segreta, i fiori intonano una melodia d\'oro che culla il mondo intero.',
    illustrationType: 'flower',
    accentColor: '#7daf6b',        // verde giardino
    accentColorLight: '#f2faf0',   // verde menta chiarissimo
    text: `Nel cuore di una foresta antica e segreta, nascosto dietro una cascata d'acqua d'argento, esisteva un giardino magico in cui i fiori non si limitavano a profumare, ma sapevano cantare. 

Ogni fiore aveva la sua voce speciale. Le rose cantavano con un tono vellutato e regale, le violette sussurravano note dolci e timide, e i grandi girasoli accompagnavano il coro con un ritmo profondo e caldo come la terra.

La direttrice di questo incredibile coro era una fatina dei fiori di nome Flora. Con la sua bacchetta d'oro, Flora guidava i fiori ogni sera per creare la melodia più importante di tutte: la Sinfonia della Buonanotte. Questa sinfonia viaggiava sulle ali delle farfalle notturne ed entrava nelle case per portare serenità ai cuori di chi dormiva.

Una sera, però, accadde un imprevisto. Un piccolo campanellino blu di nome Brio, il fiore addetto a dare il tocco finale alla melodia con il suo squillante 'Din-Don', perse la voce a causa di un colpo di freddo.

Tutto il coro era preoccupato. 'Senza il tocco finale di Brio, la canzone non sarà completa, e i bambini faranno fatica ad addormentarsi!' disse Flora stringendo le mani.

Brio era tristissimo, con la sua testolina blu reclinata verso terra. Ma in quel momento, una minuscola lucciola di nome Sparkle si posò sul suo petalo. 'Non disperare, Brio,' sussurrò la lucciola. 'Anche se non puoi cantare ad alta voce, puoi vibrare con il cuore. Io brillerò a tempo con i tuoi pensieri felici.'

Flora diede il via. Il coro dei fiori iniziò a cantare. Le rose, le violette e i girasoli unirono le loro voci in un'armonia meravigliosa. Quando arrivò il momento del campanellino, Brio chiuse gli occhi e pensò a quanto amasse i sogni dei bambini. Vibrò dolcemente e, nello stesso istante, Sparkle emise un bagliore dorato e caldo che illuminò il giardino.

In quel momento, pur senza un suono forte, una bellissima vibrazione di pace si diffuse nell'aria. Era un tocco magico persino più dolce del solito.

La sinfonia raggiunse il mondo intero, e quella notte tutti i bambini fecero i sogni più magici e luminosi di sempre, cullati dal silenzioso amore del campanellino blu e della sua amica lucciola.`
  },
  {
    id: 'gufo-viaggio-oro',
    title: 'Il Viaggio d\'Oro del Signor Gufo',
    category: 'Avventura & Animali',
    duration: '5 min',
    description: 'Il saggio gufo Barnaba vola attraverso il cielo stellato per raccogliere i sogni d\'oro perduti.',
    illustrationType: 'owl',
    accentColor: '#c9a84c',        // oro/ambra del gufo
    accentColorLight: '#fffbf0',   // crema dorata chiarissima
    text: `Il signor Barnaba era un gufo molto saggio e distinto, con due grandi occhi dorati che brillavano come lanterne e piume soffici color cioccolato. Barnaba non era un gufo comune: era il Guardiano dei Sogni Perduti.

Ogni notte, quando tutti andavano a dormire, Barnaba indossava i suoi piccoli occhiali tondi, spiegava le ali e decollava silenzioso dal ramo del suo vecchio albero di quercia. Il suo compito era volare tra i tetti delle case e catturare con la sua rete da pesca fatta d'aria e polvere di stelle i pensieri spaventosi o i brutti sogni dei bambini, sostituendoli con sogni fatti d'oro e fantasia.

Una notte di luna piena, Barnaba notò un insolito silenzio nella foresta. Volando sopra un ruscello argentato, vide un piccolo scoiattolo di nome Pepe sveglio sul ramo di un pino, che piangeva stringendo la sua codina soffice.

Barnaba atterrò con la massima delicatezza sul ramo accanto. 'Buonasera, piccolo Pepe. Come mai non sei nella tua tana calda a riposare?' chiese con la sua voce profonda e melodiosa.

'Oh, signor Barnaba,' singhiozzò Pepe, 'ho perso la mia noce d'oro dei sogni! Senza di essa, ho paura che farò brutti sogni e non potrò più svegliarmi felice.'

Barnaba sorrise, rasserenando Pepe. 'La noce d'oro dei sogni non è un oggetto che puoi perdere nel bosco, piccolo mio. Essa vive dentro di te, nei tuoi ricordi felici e nei tuoi pensieri gentili. Ma vieni, facciamo un viaggio insieme nel cielo della mente.'

Il saggio gufo invitò Pepe a salire sulla sua schiena morbida. Barnaba si alzò in volo, muovendosi così lentamente che sembrava di scivolare sulle onde di un lago calmo. Volarono sopra i boschi silenziosi, accarezzando le nuvole che profumavano di zucchero filato e guardando le stelle cadenti che lasciavano scie luminose.

'Chiudi gli occhi, Pepe,' sussurrò Barnaba. 'Pensa al calore della tua tana, al profumo delle nocciole e al sole caldo del mattino. Questa è la tua melodia, questa è la tua noce d'oro.'

Mentre volavano, Pepe si sentì cullato dal battito regolare delle ali di Barnaba e dal calore delle sue piume. Pian piano, la paura svanì, sostituita da una sensazione di pace immensa. Prima ancora che Barnaba tornasse all'albero, Pepe si era addormentato profondamente sulla schiena del gufo, con un sorriso sereno sul musetto.

Barnaba lo ripose delicatamente nella sua tana calda, rimboccandogli le coperte di foglie secche. 'Fai sogni d'oro, piccolo scoiattolo,' sussurrò, prima di riprendere il suo volo protettivo nel cielo della notte.`
  },
  {
    id: 'delfino-luna',
    title: 'Il Delfino Magico e la Luna Silenziosa',
    category: 'Mare & Relax',
    duration: '4 min',
    description: 'Nelle profondità dell\'oceano d\'argento, il piccolo delfino guarisce le onde del mare con una carezza.',
    illustrationType: 'dolphin',
    accentColor: '#4a9bbe',        // azzurro oceano
    accentColorLight: '#f0faff',   // celeste chiarissimo
    text: `Nelle acque profonde e tranquille dell'oceano d'argento, dove la notte specchiava tutte le sue stelle, viveva un piccolo delfino di nome Kai. Kai aveva una pelle fatata che brillava di sfumature madreperla sotto la luce lunare.

A differenza degli altri delfini che amavano fare salti altissimi durante il giorno sotto il sole caldo, Kai preferiva nuotare di notte, muovendosi in modo sinuoso e silenzioso tra le onde placide del mare.

Una notte, il mare era insolitamente agitato. Grandi onde nere si scontravano tra loro, facendo rumore e spaventando le piccole stelle marine e i pesciolini che cercavano di dormire al riparo delle barriere coralline.

Kai guardò in alto e vide che la Luna era coperta da un velo di fitte nuvole grigie, impossibilitata a diffondere la sua luce calmante sulle acque. Il mare era preoccupato perché si sentiva solo nell'oscurità.

'Ci penso io,' pensò Kai con coraggio.

Il piccolo delfino iniziò a nuotare disegnando grandi cerchi sulla superficie dell'acqua. Ogni volta che Kai passava, la sua scia luminosa di madreperla rilasciava una magica polvere marina scintillante che calmava le onde, trasformando la schiuma agitata in un tappeto di bolle soffici e silenziose, come un cuscino marino.

Mentre nuotava cantando una melodia sottomarina dolcissima, le nuvole in cielo iniziarono a diradarsi sotto il richiamo di quella pace. La Luna Silenziosa riapparve, inviando un raggio di luce d'oro dritto su Kai, come ad abbracciarlo.

Il mare, ora calmo e cullato dalla luce lunare e dalle scivolate luminose di Kai, si placò del tutto, tornando a cullare docilmente tutte le creature oceaniche.

Kai si lasciò galleggiare sulla superficie dell'acqua tiepida, guardando la luna e sentendosi parte di quella bellissima armonia. Sapeva che, finché ci fosse stato lui a coccolare le onde, il mare avrebbe sempre dormito sonni tranquilli.`
  }
];
