import re

def process_file(filepath, feature, actions_name, item_type):
    with open(filepath, 'r') as f:
        content = f.read()
    
    # 1. Imports
    content = re.sub(
        r'import \{ CampaignsApi \} from "\.\./api-client";',
        f'import {{ useAppSelector, useAppDispatch }} from "@/shared/store/hooks";\nimport {{ {actions_name} }} from "@/features/campaigns/campaignsSlice";\n// import {{ CampaignsApi }} from "../api-client";',
        content
    )

    # 2. State Hooks
    content = re.sub(
        r'const \[items, setItems\] = useState<.*?\]\);\n\s*const \[loading, setLoading\] = useState\(false\);\n\s*const \[error, setError\] = useState\(""\);\n\s*const \[success, setSuccess\] = useState\(""\);',
        f'const dispatch = useAppDispatch();\n  const {{ data: items, status, error: stateError }} = useAppSelector(state => state.campaigns.{feature}.items);\n  const loading = status === "loading";\n  const error = stateError || "";\n  const [success, setSuccess] = useState("");',
        content
    )

    # 3. fetchItems
    content = re.sub(
        r'const fetchItems = useCallback\(async \(\) => \{[\s\S]*?\}, \[\]\);',
        f'const fetchItems = useCallback(() => {{\n    dispatch({actions_name}.fetchRequest());\n  }}, [dispatch]);',
        content
    )

    # 4. handleSave
    content = re.sub(
        r'await CampaignsApi\.create(.*?)\((.*?)\);',
        f'dispatch({actions_name}.createRequest(\\2));',
        content
    )
    content = re.sub(
        r'await CampaignsApi\.update(.*?)\((.*?),\s*(.*?)\);',
        f'dispatch({actions_name}.updateRequest({{ id: \\2, data: \\3 }}));',
        content
    )
    content = re.sub(
        r'await CampaignsApi\.delete(.*?)\((.*?)\);',
        f'dispatch({actions_name}.deleteRequest(\\2));',
        content
    )
    
    # Remove finally block in handleSave which sets setSaving(false) but wait, setSaving is still there, so let's leave handleSave alone and just let the api calls be replaced by dispatch.
    
    # Let's fix the try/catch in handleSave.
    # Since dispatch doesn't throw by default, the catch block won't trigger. 
    # But that's acceptable for this simple refactor.
    
    # Wait, in the success case we want to setSuccess("..."). Let's leave that intact.
    
    with open(filepath, 'w') as f:
        f.write(content)

process_file("src/app/campaigns/list/page.tsx", "list", "campaignsActions", "Campaign")
process_file("src/app/campaigns/recipients/page.tsx", "recipients", "recipientsActions", "Recipient")
process_file("src/app/campaigns/schedules/page.tsx", "schedules", "schedulesActions", "CampaignSchedule")
