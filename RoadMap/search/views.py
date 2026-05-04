from django.http import JsonResponse
from .models import SearchHistory
import json

def save_search_query(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        query = data.get('query', '') 
        
        if query:
            SearchHistory.objects.create(user=request.user, query=query)
            return JsonResponse({"status": "success"})
        else:
            return JsonResponse({"status": "error", "message": "Query is required"})

def get_search_history(request):
    if request.user.is_authenticated:
        history = SearchHistory.objects.filter(user=request.user).order_by('-timestamp')
        history_data = [
            {
                "query": entry.query,
                "timestamp": entry.timestamp,
            }
            for entry in history
        ]
        return JsonResponse({"history": history_data})
    else:
        return JsonResponse({"history": []}, status=401)
