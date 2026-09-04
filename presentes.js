/* =========================================
   CONFIGURAÇÃO PIX
========================================= */

const pixConfig = {

  // Telefone precisa estar no padrão internacional
  key: "+5583982188766",

  // Use o nome do titular da chave Pix
  receiverName: "ISAIAS FERREIRA",

  receiverCity: "CAMPINA GRANDE",

  txid: "***"

};


/* =========================================
   FORMATADOR DOS CAMPOS PIX
========================================= */

function field(id, value) {

  return (
    id +
    String(value.length).padStart(2, "0") +
    value
  );

}


/* =========================================
   CRC16 PIX
========================================= */

function crc16(payload) {

  let crc = 0xFFFF;


  for (
    let i = 0;
    i < payload.length;
    i++
  ) {

    crc ^=
      payload.charCodeAt(i) << 8;


    for (
      let bit = 0;
      bit < 8;
      bit++
    ) {

      if (
        (crc & 0x8000) !== 0
      ) {

        crc =
          (crc << 1) ^
          0x1021;

      } else {

        crc =
          crc << 1;

      }


      crc &= 0xFFFF;

    }

  }


  return crc
    .toString(16)
    .toUpperCase()
    .padStart(4, "0");

}


/* =========================================
   GERADOR PIX
========================================= */

function generatePix(value) {

  const amount =
    Number(value).toFixed(2);


  /*
    Campo 26:
    Merchant Account Information
  */

  const merchantAccount =

    field(
      "00",
      "BR.GOV.BCB.PIX"
    )

    +

    field(
      "01",
      pixConfig.key
    );


  /*
    Additional Data Field
  */

  const additionalData =

    field(
      "05",
      pixConfig.txid
    );


  /*
    Payload principal
  */

  let payload =

    field(
      "00",
      "01"
    )

    +

    field(
      "26",
      merchantAccount
    )

    +

    field(
      "52",
      "0000"
    )

    +

    field(
      "53",
      "986"
    )

    +

    field(
      "54",
      amount
    )

    +

    field(
      "58",
      "BR"
    )

    +

    field(
      "59",
      pixConfig.receiverName
        .substring(0, 25)
        .toUpperCase()
    )

    +

    field(
      "60",
      pixConfig.receiverCity
        .substring(0, 15)
        .toUpperCase()
    )

    +

    field(
      "62",
      additionalData
    );


  /*
    Campo do CRC
  */

  payload += "6304";


  const checksum =
    crc16(payload);


  return (
    payload +
    checksum
  );

}


/* =========================================
   ELEMENTOS
========================================= */

const giftCards =
  document.querySelectorAll(
    ".gift-card"
  );


const modal =
  document.getElementById(
    "pixModal"
  );


const modalGiftName =
  document.getElementById(
    "modalGiftName"
  );


const modalGiftValue =
  document.getElementById(
    "modalGiftValue"
  );


const pixCode =
  document.getElementById(
    "pixCode"
  );


const qrCode =
  document.getElementById(
    "qrCode"
  );


const closeModal =
  document.getElementById(
    "closeModal"
  );


const copyPix =
  document.getElementById(
    "copyPix"
  );


const copyFeedback =
  document.getElementById(
    "copyFeedback"
  );


/* =========================================
   FORMATAR VALOR
========================================= */

function formatMoney(value) {

  return Number(value)
    .toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL"
      }
    );

}


/* =========================================
   ABRIR PRESENTE
========================================= */

giftCards.forEach(
  (card) => {

    const button =
      card.querySelector(
        ".gift-button"
      );


    button.addEventListener(
      "click",
      () => {

        const giftName =
          card.dataset.name;


        const giftValue =
          card.dataset.value;


        /*
          Gera o código Pix
        */

        const generatedPix =
          generatePix(
            giftValue
          );


        /*
          Atualiza modal
        */

        modalGiftName.textContent =
          giftName;


        modalGiftValue.textContent =
          formatMoney(
            giftValue
          );


        pixCode.value =
          generatedPix;


        copyFeedback.textContent =
          "";


        /*
          Remove QR anterior
        */

        qrCode.innerHTML =
          "";


        /*
          Gera novo QR Code
        */

        new QRCode(
          qrCode,
          {

            text:
              generatedPix,

            width:
              220,

            height:
              220,

            correctLevel:
              QRCode
                .CorrectLevel
                .M

          }
        );


        /*
          Abre modal
        */

        modal.classList.add(
          "active"
        );


        modal.setAttribute(
          "aria-hidden",
          "false"
        );


        document.body.style.overflow =
          "hidden";

      }
    );

  }
);


/* =========================================
   FECHAR MODAL
========================================= */

function hideModal() {

  modal.classList.remove(
    "active"
  );


  modal.setAttribute(
    "aria-hidden",
    "true"
  );


  document.body.style.overflow =
    "";

}


/*
  Botão X
*/

closeModal.addEventListener(
  "click",
  hideModal
);


/*
  Clique fora
*/

modal
  .querySelector(
    ".modal-overlay"
  )
  .addEventListener(
    "click",
    hideModal
  );


/*
  ESC no computador
*/

document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "Escape"
    ) {

      hideModal();

    }

  }
);


/* =========================================
   COPIAR PIX
========================================= */

copyPix.addEventListener(
  "click",
  async () => {

    try {

      await navigator
        .clipboard
        .writeText(
          pixCode.value
        );


      copyFeedback.textContent =
        "Código Pix copiado!";


      copyPix.textContent =
        "PIX COPIADO ✓";


      setTimeout(
        () => {

          copyPix.textContent =
            "COPIAR CÓDIGO PIX";


          copyFeedback.textContent =
            "";

        },
        2500
      );

    } catch (error) {

      /*
        Alternativa para navegadores antigos
      */

      pixCode.select();


      document.execCommand(
        "copy"
      );


      copyFeedback.textContent =
        "Código Pix copiado!";

    }

  }
);