from model import {{model.name}}

if __name__ == "__main__":
{%- filter indent(width=4) %}
#init number of model steps to take
stepsToTake  = {{model.stepsCount or 0}}

#init agent-type <-> init number of agent type dict
modelAgentNums = dict()
{%- for agent in agents %}
initModelAgentNums["{{agent.name}}"] = {{agent.initNumber}}
{%- endfor %}

model = {{model.name}}(initModelAgentNums)
{%- if model.stepsCount != None %}

#take the defined model steps
for step in range(stepsToTake):
{%- filter indent(width=4) %}
model.step()
{%- endfilter -%}
{%- endif -%}
{%- endfilter -%}