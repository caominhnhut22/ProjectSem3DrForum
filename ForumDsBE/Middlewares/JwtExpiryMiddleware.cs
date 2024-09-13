//using microsoft.identitymodel.tokens;
//using system.identitymodel.tokens.jwt;
//using system.net;
//using system.text;

//namespace forumds.middlewares
//{
//    public class jwtexpirymiddleware
//    {
//        private readonly requestdelegate _next;
//        private static int _loggedinuserscount = 0;
//        private static readonly object _lockobject = new object();
//        private readonly iconfiguration _configuration;

//        public jwtexpirymiddleware(requestdelegate next, iconfiguration configuration)
//        {
//            _next = next;
//            _configuration = configuration;
//        }

//        public async task invoke(httpcontext context)
//        {
//            var token = context.request.headers["authorization"].firstordefault()?.split(" ").last();

//            if (token != null)
//            {
//                var tokenhandler = new jwtsecuritytokenhandler();
//                var key = encoding.ascii.getbytes(_configuration["jwt:key"]); 

//                try
//                {
//                    tokenhandler.validatetoken(token, new tokenvalidationparameters
//                    {
//                        validateissuersigningkey = true,
//                        issuersigningkey = new symmetricsecuritykey(key),
//                        validateissuer = true,
//                        validissuer = _configuration["jwt:issuer"],
//                        validateaudience = true,
//                        validaudience = _configuration["jwt:audience"],
//                        validatelifetime = true,
//                        clockskew = timespan.zero
//                    }, out securitytoken validatedtoken);

//                    await _next(context);
//                }
//                catch
//                {
//                    lock (_lockobject)
//                    {
//                        _loggedinuserscount--;
//                    }

//                    context.response.statuscode = (int)httpstatuscode.unauthorized;
//                    return;
//                }
//            }
//            else
//            {
//                await _next(context);
//            }
//        }
//    }
//}
