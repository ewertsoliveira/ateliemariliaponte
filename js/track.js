/* ============================================================
   Rastreamento de conversão — clique em "Agendar atendimento"

   O botão abre o WhatsApp, que é a conversão real do site: é ali
   que a noiva vira contato. Sem isto, Google e Meta só registram
   visualização de página e não sabem quais anúncios geram contato.

   META: dispara de imediato, não depende de configuração externa.

   GOOGLE ADS: precisa do rótulo de conversão, gerado no painel em
   Objetivos → Conversões → [ação] → Configurar tag. É a parte
   depois da barra em "AW-18443361645/XXXXXXXXXXX". Enquanto
   ROTULO_CONVERSAO estiver vazio, o evento do Google não dispara —
   melhor não enviar nada do que enviar para um destino inválido.
   ============================================================ */
(function () {
    'use strict';

    var GOOGLE_ADS_ID = 'AW-18443361645';
    var ROTULO_CONVERSAO = '';   // <<< cole aqui o rótulo do Google Ads

    // Evento do Meta. 'Contact' descreve iniciar uma conversa.
    // Trocar para 'Lead' se as campanhas forem otimizadas por lead.
    var EVENTO_META = 'Contact';

    function registrarConversao() {
        if (typeof window.fbq === 'function') {
            window.fbq('track', EVENTO_META);
        }
        if (ROTULO_CONVERSAO && typeof window.gtag === 'function') {
            window.gtag('event', 'conversion', {
                send_to: GOOGLE_ADS_ID + '/' + ROTULO_CONVERSAO
            });
        }
    }

    // Delegação no documento: pega qualquer link de WhatsApp, inclusive
    // os que forem adicionados depois, e sobrevive a mudanças de layout.
    document.addEventListener('click', function (e) {
        var alvo = e.target;
        if (!alvo || typeof alvo.closest !== 'function') return;
        var link = alvo.closest('a[href*="wa.me"], a[href*="api.whatsapp.com"]');
        if (link) registrarConversao();
    }, true);
})();
