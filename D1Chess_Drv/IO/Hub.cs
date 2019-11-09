//using Microsoft.AspNetCore.SignalR;
//using System;
//using System.Threading.Tasks;
//using SignalRHub = Microsoft.AspNetCore.SignalR.Hub;

//namespace D1Chess_Srv.IO
//{
//    public class Hub : SignalRHub
//    {

//        public static IHubContext<Hub> StaticContext;

//        public override Task OnConnectedAsync()
//        {
//            return base.OnConnectedAsync();
//        }
//        public static void Send(string pAction, object pData)
//        {
//            StaticContext.Clients.All.SendAsync(pAction, pData);
//        }
//        public static void Send(Guid? pConnectionId, string pAction, object pData)
//        {
//            StaticContext.Clients.Client(pConnectionId.ToString()).SendAsync(pAction, pData);
//        }

//        //public async Task SendMessage(string user, string message)
//        //{
//        //    await Clients.All.SendAsync("ReceiveMessage", user, message);
//        //}
//    }
//}
