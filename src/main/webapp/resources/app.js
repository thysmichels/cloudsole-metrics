/**
 * Created by tmichels on 8/19/14.
 */

//var stompClient = null;
var updateOpts = {'minVal':'0','maxVal':'100','newVal':'1'};

var randomData;
var socket = new SockJS('/metrics');
var client = Stomp.over(socket);

client.connect('admin', 'password', function(frame) {

    client.subscribe("/data", function(message) {
        var point = [ (new Date()).getTime(), parseInt(message.body) ];
        gaugeUpdate('cf-gauge-1', {'minVal':'0','maxVal':'100','newVal':parseInt(message.body)})
        $('#spark-1').each(function(){

            customSparkOptions = {};
            customSparkOptions.minSpotColor = true;
            var sparkOptions = cf_defaultSparkOpts;
            var sparkOptions = $.extend({}, cf_defaultSparkOpts, customSparkOptions);

            data.push(parseInt(message.body));
            createSparkline($(this), data, sparkOptions);
        });

        $('#metric-1 .metric').html(message.body);
        $('#metric-1 .large').html(message.body);
        $('#metric-2 .metric').html(message.body);
        $('#metric-2 .large').html(message.body);
        var element = $(this).data('update');
        cf_rSVPs[$('#svp-1').attr('id')].chart.update(parseInt(message.body));
        $('#svp-1 .chart').data('percent', parseInt(message.body));
        $('#svp-1 .metric').html(message.body);
       // $('#cf-svmc-sparkline .metric').html(message.body);

        $('#cf-rag-1').each(function(){
            // Dummy data for RAG
            ragData = [60,30,parseInt(message.body)];
            ragLabels = ['Success','Bounce','Abandoned'];
            ragOpts = {postfix:'%'}

            cf_rRags[$(this).prop('id')] = new RagChart($(this).prop('id'), ragData, ragLabels, ragOpts);
        });

        $('#cf-pie-1').each(function(){

            var pdata = [
                {
                    value : parseInt(message.body),
                    color : pieSegColors[3],
                    label: 'Success'
                },
                {
                    value : parseInt(message.body)+50,
                    color : pieSegColors[2],
                    label: 'Bounce'
                },
                {
                    value: parseInt(message.body)+100,
                    color: pieSegColors[1],
                    label: 'Abandoned'
                }
            ]

            var $container = $(this);
            var pId = $container.prop('id');

            // Store chart information
            cf_rPs[pId] = {};
            cf_rPs[pId].data = pdata;


             // Set options per chart
             customOptions = {};
             customOptions.animation = false;
             cf_rPs[pId].options = customOptions;

            // Create chart
            createPieChart($container);
        });

        $('#cf-funnel-1').each(function(){
            funData = [parseInt(message.body)+3000,parseInt(message.body)+1500,parseInt(message.body)+500,parseInt(message.body)+250,parseInt(message.body)];
            funLabels = ['Visits','Cart','Checkout','Purchase','Refund'];
            funOptions = {barOpacity:true, layout:'left'};

            cf_rFunnels[$(this).prop('id')] = new FunnelChart($(this).prop('id'), funData, funLabels, funOptions);
        });

    });
});

